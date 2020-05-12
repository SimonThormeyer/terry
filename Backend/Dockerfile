FROM python:3.7

RUN apt-get update -y && \
    apt-get install -y \
    python-pip \
    python-dev \
    git

ADD . /code

COPY ./requirements.txt /code/requirements.txt

WORKDIR /code

RUN pip install -r requirements.txt

COPY . /code

EXPOSE 5000

CMD ["python3", "code/api/app.py"]
