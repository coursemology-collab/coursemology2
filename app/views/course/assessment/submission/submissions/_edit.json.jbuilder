json.assessment do
  json.(@assessment, :title, :description, :published, :autograded, :skippable,
    :tabbed_view, :password, :delayed_grade_publication)
  json.password_protected @assessment.password_protected?
end
