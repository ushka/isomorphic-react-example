import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TagsList from './TagsList';

const QuestionListItem = ({title, tags, question_id}) => (
	<div className="mb-3">
		<h3>{title}</h3>
		<div className="mb-2">
			<TagsList tags={tags} />
		</div>
		<div>
			<Link to={`/questions/${question_id}`}>
				<button className="btn btn-secondary">More info</button>
			</Link>
		</div>
	</div>
);

const QuestionList = ({questions}) => (
	<div>
		{questions ? 
			<div>
				{questions.map(question => 
					<QuestionListItem key={question.question_id} {...question}/>
				)}
			</div> : 
			<div>
				Loading questions ...
			</div>
		}
	</div>
);

const mapStateToProps = ({questions}) => ({
	questions
});

export default connect(mapStateToProps)(QuestionList);
