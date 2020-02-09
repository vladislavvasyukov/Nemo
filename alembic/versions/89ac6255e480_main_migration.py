"""main migration

Revision ID: 89ac6255e480
Revises: bb50cba07fdd
Create Date: 2020-02-09 22:24:45.884665

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '89ac6255e480'
down_revision = 'bb50cba07fdd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('companies',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('emails',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('body', sa.Text(), nullable=True),
    sa.Column('subject', sa.String(length=255), nullable=True),
    sa.Column('sender', sqlalchemy_utils.types.email.EmailType(length=255), nullable=True),
    sa.Column('error', sa.Text(), nullable=True),
    sa.Column('send_date', sa.DateTime(), nullable=True),
    sa.Column('bcc', sa.ARRAY(sqlalchemy_utils.types.email.EmailType(length=255)), nullable=True),
    sa.Column('to', sa.ARRAY(sqlalchemy_utils.types.email.EmailType(length=255)), nullable=True),
    sa.Column('cc', sa.ARRAY(sqlalchemy_utils.types.email.EmailType(length=255)), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('projects',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('email_attachments',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('path', sa.String(length=255), nullable=False),
    sa.Column('filename', sa.String(length=255), nullable=True),
    sa.Column('email_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['email_id'], ['emails.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tasks',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=128), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('status', sqlalchemy_utils.types.choice.ChoiceType(), nullable=True),
    sa.Column('deadline', sa.DateTime(timezone=True), nullable=True),
    sa.Column('work_hours', sa.Float(), nullable=True),
    sa.Column('executor_id', sa.Integer(), nullable=True),
    sa.Column('manager_id', sa.Integer(), nullable=True),
    sa.Column('author_id', sa.Integer(), nullable=True),
    sa.Column('project_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['executor_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['manager_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('text', sa.String(length=128), nullable=False),
    sa.Column('date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('task_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('task_members',
    sa.Column('task_id', sa.Integer(), nullable=False),
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['member_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
    sa.PrimaryKeyConstraint('task_id', 'member_id', name='_member_task_uc')
    )
    op.create_table('task_tags',
    sa.Column('task_id', sa.Integer(), nullable=False),
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
    sa.PrimaryKeyConstraint('task_id', 'tag_id', name='_tag_task_uc')
    )
    op.create_table('notifications',
    sa.Column('comment_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(timezone=True), nullable=True),
    sa.Column('date_read', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['comment_id'], ['comments.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('comment_id', 'user_id', name='_notification_uc')
    )
    op.add_column('users', sa.Column('_phone_number', sa.Unicode(length=20), nullable=True))
    op.add_column('users', sa.Column('company_id', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('country_code', sa.Unicode(length=8), nullable=True))
    op.add_column('users', sa.Column('date_deleted', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('email', sqlalchemy_utils.types.email.EmailType(length=255), nullable=True))
    op.add_column('users', sa.Column('password', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('skype', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('telegram', sa.String(length=255), nullable=True))
    op.alter_column('users', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.create_foreign_key(None, 'users', 'companies', ['company_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='foreignkey')
    op.alter_column('users', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.drop_column('users', 'telegram')
    op.drop_column('users', 'skype')
    op.drop_column('users', 'password')
    op.drop_column('users', 'email')
    op.drop_column('users', 'date_deleted')
    op.drop_column('users', 'country_code')
    op.drop_column('users', 'company_id')
    op.drop_column('users', '_phone_number')
    op.drop_table('notifications')
    op.drop_table('task_tags')
    op.drop_table('task_members')
    op.drop_table('comments')
    op.drop_table('tasks')
    op.drop_table('email_attachments')
    op.drop_table('tags')
    op.drop_table('projects')
    op.drop_table('emails')
    op.drop_table('companies')
    # ### end Alembic commands ###