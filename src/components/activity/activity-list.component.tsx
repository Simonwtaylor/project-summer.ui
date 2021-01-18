import * as React from 'react';
import { Card, Header, Icon, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { IActivity } from '../../lib';

export interface IActivityListProps {
	activities: any[];
	colourClass: string;
}

const ActivityList: React.FC<IActivityListProps> = ({
	activities,
	colourClass,
}) => {
	const sortedActivities = activities.sort((a: any, b: any) => {
		return Date.parse(b.dateAdded)-Date.parse(a.dateAdded);
	});

	return (
		<div
			className={'activities'}
			style={{
				padding: '16px'
			}}
		>
			<Header
				as='h3'
				dividing
				className={colourClass}
			>
				Activities
			</Header>
			{sortedActivities.map(
				(activity) => {
					return (
						<Card>
							<Card.Header
								style={{
									padding: '8px 16px',
								}}
							>
								<Icon name={'history'} /> {activity.taskName}
							</Card.Header>
							<Card.Description
								style={{
									padding: '8px 16px',
								}}
							>
								{activity.content}
							</Card.Description>
							<Card.Content>
								<Popup
									content={activity.user.displayName}
									key={`taskactivityuserphoto`}
									trigger={
										<Image
											src={activity.user.photoURL}
											circular={true}
											size={'tiny'}
											style={{
												width: '30px',
												display: 'inline-block',
												marginRight: '10px',
											}}
										/>
									}
								/>
								{moment(activity.dateAdded).fromNow()}
							</Card.Content>
						</Card>
					)
				}
			)}
		</div>
	);
}

export default ActivityList;
