echo "Waiting for mongoDB"
while ! nc -z 0.0.0.0 27017 2>/dev/null
do
  sleep 5;
  echo "."
done
echo "Database is up."

python /app/api/__init__.py
