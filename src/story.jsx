import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import moment from 'moment';

import SwipeSlider from './index.jsx';

function updateArray(array, index, item) {
	let updatedItem;
	if (typeof item === 'object') {
		updatedItem = {
			...array[index],
			...item
		};
	} else {
		updatedItem = item;
	}
	return [
		...array.slice(0, index),
		updatedItem,
		...array.slice(index + 1),
	];
}

class SliderItem extends React.Component {
	render() {
		let {startDate, endDate} = this.props,
			days = moment(endDate).diff(moment(startDate), 'days') + 1;

		return <div className="slider-item">
			<div className="date-context">
				<div style={{
						position: 'absolute',
                        width: '100%',
                        height: '100%'
						}}>
					<span className="start date">
						{startDate.toDateString()}
					</span>
					<span className="to" key="to">
						{' to '}
					</span>
					<span className="end date" key="end">
						{endDate.toDateString()}
					</span>
					<span className="days">({days}d)</span>
				</div>
			</div>
		</div>;
	}
}

class FlexibleSwipeContainer extends React.Component {
	
	constructor(props) {
		super(props);
		
		const items = [
			{
				startDate: new Date('2016-06-24'),
				endDate: new Date('2016-06-27'),
				key: 0,
				type: -1
			}, {
				startDate: new Date('2016-06-26'),
				endDate: new Date('2016-06-27'),
				disabled: true,
				key: 1
			}, {
				startDate: new Date('2016-06-27'),
				endDate: new Date('2016-06-29'),
				key: 2,
				type: 1
			}
		];
		items[0].isSearching = true;
		items[2].isSearching = true;
		
		this.state = {items: items};
		this.finishSearch(0);
		this.finishSearch(2);
	}
	
	render() {
		const {canForward, canBackward, ...props} =  this.props;
		
		canForward && (props.lastAction = this.addFutureSearch.bind(this));
		canBackward && (props.firstAction = this.addPastSearch.bind(this));
		
		return (
			<SwipeSlider {...props} className={this.props.searchStyle}>
				{
					this.state.items.map(function (availability, i) {
						return (
							<SliderItem key={ availability.key || i} {...availability}/>
						)
					})
				}
			</SwipeSlider>
		)
	}
	
	finishSearch(key) {
		setTimeout(() => {
			this.state.items.map(((item, i) => {
				if (item.key === key) {
					const newItem = {
						...item,
						isSearching: false,
					};
					this.setState({
						items: updateArray(this.state.items, i, newItem)
					});
				}
			}).bind(this))
		}, 1000);
	}
	
	addPastSearch(index) {
		const newKey = this.state.items.length;
		this.setState({
			items: [{
				startDate: new Date('2016-06-26'),
				endDate: new Date('2016-07-21'),
				isSearching: true,
				key: newKey,
				type: -1
			}].concat(this.state.items)
		});
		
		this.finishSearch(newKey);
	}
	
	addFutureSearch(index) {
		const newKey = this.state.items.length;
		this.setState({
			items: this.state.items.concat([{
				startDate: new Date('2016-06-27'),
				endDate: new Date('2016-07-22'),
				isSearching: true,
				key: newKey,
				type: 1
			}])
		});
		
		this.finishSearch(newKey);
	}
}

const storybook = storiesOf('SwipeSlider');
const defaultProps = {
	offset: 50,
	currentIndex: 1,
	canForward: false,
	canBackward: false,
	onSelect: action('has selected item'),
	lastAction: action('search the next dates'),
	firstAction: action('search the past dates')
};

storybook
	.add('with more than 3 items, can not search', () => {
		const dates = [
			{
				startDate: new Date('2016-06-24'),
				endDate: new Date('2016-06-27')
			}, {
				startDate: new Date('2016-06-26'),
				endDate: new Date('2016-06-28')
			}, {
				startDate: new Date('2016-06-27'),
				endDate: new Date('2016-06-29')
			}, {
				startDate: new Date('2016-07-16'),
				endDate: new Date('2016-07-27')
			}, {
				startDate: new Date('2016-07-27'),
				endDate: new Date('2016-08-11')
			}
		];
		return <SwipeSlider {...defaultProps} >
			{
				dates.map(function (availability, i) {
					return (
						<SliderItem key={ availability.key || i} {...availability}/>
					)
				})
			}
		</SwipeSlider>
	})
	.add('can add new future search, can scroll forward', () => {

		return <FlexibleSwipeContainer {...defaultProps} canForward={true}/>
	})
	.add('can add new past search, can scroll backward', () => {

		return <FlexibleSwipeContainer {...defaultProps} canBackward={true}/>
	});
