import { schema } from 'normalizr';

const post = new schema.Entity('posts');
const topic = new schema.Entity('topics', { posts: [post] });
const answer = new schema.Entity('answers');
const explanation = new schema.Entity('explanations');
const question = new schema.Entity('questions', {
  answer,
  explanation,
  topic,
});

const assessmentSchema = new schema.Object({ questions: new schema.Array(question) });

export default assessmentSchema;
