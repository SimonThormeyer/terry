FROM python:3.7

WORKDIR /code

RUN apt-get update -y && \
    apt-get install -y \
    python-pip \
    python-dev

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "run"]
