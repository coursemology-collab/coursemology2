class CreatePendingEmails < ActiveRecord::Migration[5.1]
  def change
    create_table :pending_emails do |t|
      t.belongs_to :user_email,
                   null: false
      t.references :trigger, polymorphic: true
      t.string :event
      t.timestamps null: false
    end
  end
end
