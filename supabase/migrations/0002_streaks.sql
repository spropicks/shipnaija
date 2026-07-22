-- 0002: add last_log_date to profiles for streak tracking
alter table profiles add column if not exists last_log_date date;
