import React, {Component, PropTypes} from 'react';
require('../src/styles/main.scss');

const OFFSET = 50,
	MaxDistance = 30;

class SwipeSlider extends Component {

	static propTypes = {
		onMoveEnd: PropTypes.func, // will run before each drag end event. return false to prevent moving to next item.
		lastAction: PropTypes.func, // will run after moving to the last item
		firstAction: PropTypes.func, // will run after moving to the first item
		onSelect: PropTypes.func.isRequired, // when moving to a new item, pass in the item key
		children: PropTypes.array.isRuired // slider items. can be any customise component
	};

	constructor(props) {
		super(props);
		this.previousLengthOffset = 0;
		this.OverThreshold = false;
		this.currentIndex = this.props.currentIndex || 0;
	}

	componentDidMount() {
		// Get current dom reference
		this.domStyle = this.refs.slider.style;
		// initialize the slider position
		this.domStyle.webkitTransform = 'translateY(-' + OFFSET * this.currentIndex + 'px) translateZ(0)';
		this.domStyle.webkitTransition = 'transform 300ms ease';
		// change the className of selected item
		this.changeSelectedItem();
	}

	componentWillReceiveProps(newProps) {
		const newChildren = newProps.children,
			children = this.props.children;

		// Diff the new children and old children, find the different offset index from the beginning.
		if (newChildren.length > children.length &&
			newChildren[0].key != children[0].key) {

			for (let i = 1; i < newChildren.length; i++) {
				if (newChildren[i].key === children[0].key) {
					this.previousLengthOffset += i;
					break;
				}
			}
		}
	}

	render() {
		return (
			<div className={'swipe-slider ' + this.props.className}
			     onTouchStart={this.onDragStart.bind(this)}
			     onTouchMove={this.onDrag.bind(this)}
			     onTouchEnd={this.onDragEnd.bind(this)}>
				<div className="swipe-slider-list" ref="slider" style={{
					top : OFFSET - 2
				}}>{
						this.props.children.map(function (item, i) {
							return (
								<div className="swipe-slider-item"
								     key={ item.key}
								     style={{
										position: 'absolute',
										top: 0,
										left: 0,
										height: OFFSET,
										width:'100%',
										lineHeight: OFFSET + 'px',
										transform: 'translateY(' + (i - this.previousLengthOffset) * OFFSET + 'px)'
									}}>
									{item}
								</div>
							)
						}.bind(this))
					}
				</div>
			</div>
		)
	}

	next() {
		if (this.currentIndex + this.previousLengthOffset === this.props.children.length - 1) {
			this.props.lastAction(this.currentIndex);
		}
	}

	prev() {
		if (this.currentIndex + this.previousLengthOffset === 0) {
			this.props.firstAction(this.currentIndex);
		}
	}

	onDragStart(e) {
		const touch = e.touches.length ? e.touches[0] : e.changedTouches[0];
		this.startY = touch.pageY;
		this.prevPoint = {
			x: touch.pageX,
			y: touch.pageY
		};
		this.startDistance = -this.currentIndex * OFFSET;
		this.domStyle.webkitTransition = '';
		this.domStyle.webkitTransform = 'translateY(' + this.startDistance + 'px) translateZ(0)';
	}

	onDrag(e) {
		const touch = e.touches.length ? e.touches[0] : e.changedTouches[0],
			offsetX = touch.pageX - this.prevPoint.x,
			offsetY = touch.pageY - this.prevPoint.y;

		if (Math.abs(offsetY) > Math.abs(offsetX)) {
			e.stopPropagation();
		} else {
			return;
		}

		e.preventDefault();

		this.prevPoint = {
			x: touch.pageX,
			y: touch.pageY
		};
		this.moveDistance = Math.floor(touch.pageY - this.startY);
		const dragDistance = this.startDistance + this.moveDistance;

		// if some operation occurs rapidly, it is not recommend to trigger state change, which may lead to performance problems
		// so I get the native browser dom element instead of changing React component states to rerender the transform
		this.domStyle.webkitTransform = 'translateY(' + dragDistance + 'px) translateZ(0)';

		if ((this.moveDistance < 0 && this.currentIndex + this.previousLengthOffset === this.props.children.length - 1) ||
			(this.moveDistance > 0 && this.currentIndex + this.previousLengthOffset === 0)) {

			this.OverThreshold = false;
		} else if (Math.abs(this.moveDistance) >= MaxDistance) {
			if (this.OverThreshold == false) {
				this.OverThreshold = true;
			}
		} else {
			this.OverThreshold = false;
		}
	}

	onDragEnd() {
		this.domStyle.webkitTransition = 'all 300ms ease';

		if (this.OverThreshold && this.onMoveEnd()) {
			this.OverThreshold = false;
			this.currentIndex += this.moveDistance > 0 ? -1 : 1;
			this.domStyle.webkitTransform = 'translateY(' + OFFSET * -this.currentIndex + 'px) translateZ(0)';
			this.changeSelectedItem();

			if (this.moveDistance > 0) {
				this.prev();
			} else if (this.moveDistance < 0) {
				this.next();
			}
		} else {
			this.domStyle.webkitTransform = 'translateY(' + this.startDistance + 'px) translateZ(0)';
		}

		this.props.onSelect(this.props.children[this.currentIndex + this.previousLengthOffset].key);
	}

	onMoveEnd() {
		if (this.props.onMoveEnd) {
			return this.props.onMoveEnd(this.currentIndex + this.previousLengthOffset, this.moveDistance > 0)
		} else {
			return true;
		}
	}

	changeSelectedItem() {
		const items = this.refs.slider.getElementsByClassName('swipe-slider-item');
		for (let i = 0; i < items.length; i++) {
			if (this.currentIndex + this.previousLengthOffset === i) {
				items[i].classList.add('selected');
			} else {
				items[i].classList.remove('selected');
			}
		}
	}
}

export default SwipeSlider