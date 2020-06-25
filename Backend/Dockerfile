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

CMD flask run

#not necessary starts without waiting
#ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
#RUN chmod +x /wait
#CMD /wait && flask run