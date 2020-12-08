import * as React from 'react';
import { Comment, Header, Form, Button } from 'semantic-ui-react';
import { IComment } from '../../lib/types/index';
import moment from 'moment';

export interface ICommentsProps {
	comments: IComment[];
	onCommentSubmit: (content: string) => void;
	colourClass?: string;
}

const Comments: React.FC<ICommentsProps> = ({
	comments,
	onCommentSubmit,
	colourClass,
}) => {
	const [content, setContent] = React.useState('');

	const handleCommentAdd = () => {
		onCommentSubmit(content);
		setContent('');
	};

	return (
		<Comment.Group
			style={{ padding: '15px' }}
		>
			<Header
				as='h3'
				dividing
				className={colourClass}
			>
				Comments
			</Header>
			{
				(comments.map((comment: IComment) => {
					return (
						<Comment>
							<Comment.Avatar src={comment.user?.photoURL} />
							<Comment.Content>
								<Comment.Author
									as='a'
									className={colourClass}
								>
									{comment.user?.displayName}
								</Comment.Author>
								<Comment.Metadata
									className={colourClass}
								>
									<div>{moment(comment.datePosted).calendar()}</div>
								</Comment.Metadata>
								<Comment.Text
									className={colourClass}
								>
									{comment.content}
								</Comment.Text>
							</Comment.Content>
						</Comment>
					)
				}))
			}
			<Form reply>
				<Form.TextArea
					value={content}
					onChange={
						(event: React.FormEvent<HTMLTextAreaElement>) => setContent(event.currentTarget.value)
					}
				/>
				<Button
					onClick={handleCommentAdd}                
					labelPosition='left'
					icon='edit'
					primary
					content={'Add Comment'}
				/>
			</Form>
		</Comment.Group>
	);
}

export default Comments;
