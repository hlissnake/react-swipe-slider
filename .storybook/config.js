import {configure, storiesOf} from '@kadira/storybook';
import React from 'react';

const req = require.context('../src/', true, /story\.jsx$/)

require('../src/styles/main.scss');

function loadStories() {
	req.keys().forEach(req);
	storiesOf('JENKINS BUILD').add('details', () => (<div>
		<p><b>Version</b> {process.env.VERSION}</p>
		<p><b>Git Branch</b> {process.env.GIT_BRANCH}</p>
		<p><b>Build Number</b> {process.env.JENKINS_BUILD}</p>
	</div>));
}

configure(loadStories, module);
