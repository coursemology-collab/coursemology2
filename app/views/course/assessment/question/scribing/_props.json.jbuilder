json.partial! 'question'

if @response
  json.partial! 'response', locals: { response: @response }
end
