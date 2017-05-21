json.(post, :id, :title, :text)
json.creator post.creator.name
json.createdAt post.created_at
json.topic post.topic_id
