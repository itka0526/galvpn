import express, { Router } from "express";
import config from "./config";
import usersRouter from "./routes/users/users";
import cors from "cors";
import { TMA_authMiddleware } from "./middleware/auth";
import { defaultErrorMiddleware } from "./middleware/error";
import keysRouter from "./routes/keys/keys";
import paymentRouter from "./routes/payment/payment";
import { webhookCallback } from "grammy";
import { bot } from "./bot/bot";
import referralRouter from "./routes/referral/referral";
import https from "https";
import http from "http";
import fs from "fs";
import { i18Middleware, i18next } from "./i18n";
import { freezeKeys, notifyExpiration } from "./jobs/freezeKeys";
import { reportError } from "./bot/reportError";

import "./cron";
import { findJobsAbove400 } from "./jobs/yandexSmena";

const app = express();

app.use(express.json());
app.use(i18Middleware.handle(i18next));
app.use(config.BOT_WEBHOOK_PATH, webhookCallback(bot, "express"));

app.use(
    cors({
        origin:
            config.nodeEnv === "development"
                ? [
                      "https://172.20.10.2:5173",
                      "https://10.7.0.2:5173",
                      "https://192.168.50.184:5173",
                      "https://127.0.0.1:5173",
                      "https://localhost:5173",
                      "http://localhost:5173",
                      "http://127.0.0.1:5173",
                  ]
                : config.CLIENT_ENDPOINT_ADDR,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.get("/", (_, res) => {
    return res.send(`
<div style="display:flex;flex-direction:column;gap:0rem;padding:1rem 2rem;">
  <p>Preperation answers: <a href="https://docs.google.com/document/d/1-M-ckOUBmcF_TLpJVLm7TSXCByLxcHvHQeLasaZtzaQ/edit?usp=sharing">Google Docs</a></p>
  <p>VPN: <a href="https://chromewebstore.google.com/detail/free-vpn-for-chrome-vpn-p/majdfhpaihoncoakbjgbdhglocklcgno?hl=en&pli=1">Chrome Store</a></p>
  <p>Copy: <a href="https://chromewebstore.google.com/detail/copy-text-easily/fagmaopcbeobbfhkeodicjekiniefdlo?hl=en">Chrome Store</a></p>
  <p>SyncShare: <a href="https://chromewebstore.google.com/detail/syncshare/lngijbnmdkejbgnkakeiapeppbpaapib">Chrome Store</a></p>
  <span>imback0526</span>
  <span>password$123</span>
  <p>AI: <a href="https://chromewebstore.google.com/detail/sider-chat-with-all-ai-gp/difoiogjjojoaoomphldepapgpbgkhkb?hl=en">Chrome Store</a></p>
  <span>AIzaSyDNCq5CdSR-Jm-xpPgIwDa0zzB4ka4sfSk</span>

  <div>
  <h1>Collected Answers</h1>
<div id="content" class="main-container">
    <div id="quiz-container">
        <h1 class="text-center mb-5">Диагностическая работа БФБО-01,02,03,04,05-22</h1>



            <div class="row">


<div id="q1" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 1
            <a class="anchor-link" aria-label="Anchor" href="#q1">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Какой бит четности необходимо добавить к следующему сообщению: 10101011. В ответ запишите значение бита четности.<br><br><br></p>

<p><strong>Ответ:</strong> 1</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>1</td>
  <td style="text-align:right;">17</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>101010110</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q2" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 2
            <a class="anchor-link" aria-label="Anchor" href="#q2">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Заполните пропуск: Бит четности служит для *** ошибки в данных<br><br>Пример ответа: исправления<br><br><br></p>

<p><strong>Ответ:</strong> обнаружения</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>проверки</td>
  <td style="text-align:right;">3</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>обнаружения</td>
  <td style="text-align:right;">17</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q3" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 3
            <a class="anchor-link" aria-label="Anchor" href="#q3">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Сопоставьте метод и его особенности:<br><br>A) Простое экспоненциальное сглаживание<br><br><br><br>B) Модель Хольта-Уинтерса<br><br>C) Модель ARIMA<br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>Учитывает тренд и сезонность</td>
              <td>

                    B

              </td>
            </tr>

            <tr>
              <td>Учитывает тренд, сезонность и цикличность</td>
              <td>

                    C

              </td>
            </tr>

            <tr>
              <td>Учитывает тренд</td>
              <td>

                    А

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>B</li>

        <li>А</li>

        <li>C</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>Учитывает тренд и сезонность
            <ul>

                <li>B (выбрали 22, верный ответ)</li>

                <li>C (выбрали 2, правильность неизвестна)</li>

            </ul>
        </li>

        <li>Учитывает тренд
            <ul>

                <li>А (выбрали 23, верный ответ)</li>

                <li>B (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>Учитывает тренд, сезонность и цикличность
            <ul>

                <li>C (выбрали 22, верный ответ)</li>

                <li>B (выбрали 1, правильность неизвестна)</li>

                <li>А (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q4" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 4
            <a class="anchor-link" aria-label="Anchor" href="#q4">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> да</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>да</td>
  <td style="text-align:right;">19</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q5" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 5
            <a class="anchor-link" aria-label="Anchor" href="#q5">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>3</td>
              <td>

                    С

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    В

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>

                    А

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>А</li>

        <li>С</li>

        <li>В</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>1
            <ul>

                <li>В (выбрали 17, верный ответ)</li>

                <li>А (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>2
            <ul>

                <li>А (выбрали 17, верный ответ)</li>

                <li>В (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>С (выбрали 18, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q6" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 6
            <a class="anchor-link" aria-label="Anchor" href="#q6">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Даны множества: M={2, 3, 4, 5, 7} и N={2, 1, 3, 6}.<br><br>Какую операцию к множествам M и N нужно применить, чтобы получить множество Z= {4, 5,7}? В ответе указать название соответствующей операции: пересечение, объединение, разность.<br><br><br></p>

<p><strong>Ответ:</strong> разность</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>разность</td>
  <td style="text-align:right;">15</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>разность</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q7" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 7
            <a class="anchor-link" aria-label="Anchor" href="#q7">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> X&lt;Y&lt;Z</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>X&lt;Y&lt;Z</td>
  <td style="text-align:right;">14</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>x&lt;y&lt;z</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>2</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>X &amp; Y &amp; Z</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q8" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 8
            <a class="anchor-link" aria-label="Anchor" href="#q8">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Чему равно математическое ожидание равномерно распределенных случайных величин из интервала от нуля до единицы?<br><br>В ответ запишите число или десятичную дробь. Пример: 0,25<br><br><br></p>

<p><strong>Ответ:</strong> 0,5</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0,5</td>
  <td style="text-align:right;">19</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q9" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 9
            <a class="anchor-link" aria-label="Anchor" href="#q9">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 1</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>1</td>
  <td style="text-align:right;">13</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q10" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 10
            <a class="anchor-link" aria-label="Anchor" href="#q10">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Если не прогуливать занятия, то вероятность сдать сессию на «хорошо» и «отлично» равно 1. Найдите информационную энтропию.<br><br><br></p>

<p><strong>Ответ:</strong> 0</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0</td>
  <td style="text-align:right;">15</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q11" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 11
            <a class="anchor-link" aria-label="Anchor" href="#q11">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 0,4</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0,4</td>
  <td style="text-align:right;">16</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q12" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 12
            <a class="anchor-link" aria-label="Anchor" href="#q12">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 30</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>30</td>
  <td style="text-align:right;">16</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q13" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 13
            <a class="anchor-link" aria-label="Anchor" href="#q13">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Дан датасет,описывающий опрос респондентов по их намерению купить новый товар, из которого выделена&nbsp; обучающая выборка и обучена модель классификации. На тестовой выборке из 100 объектов производится оценка точности модели.&nbsp;<br><br>Данные из датасетапопавшие в тестовую выборку имеют значения: в результате опроса – 70 клиентов ответили, что купят товар, 30 ответили, что не купят товар.&nbsp;<br><br>При тестировании обученной модели классификации, получен результат: из 70 клиентов, которые купят товар, модель верно классифицировала 65 (TruePositive, TP), а 5 ошибочно отнесла к классу, кто не купит (FalseNegative, FN); из 30 клиентов, кто ответил, что не купит товар модель верно классифицировала 25 (TrueNegative, TN), а 5 ошибочно отнесла к классу купит (FalsePositive, FP).<br><br>Составьте матрицу ошибок, вычислите точность (acсuracy) обученного алгоритма.<br><br>В ответе число с разделителем: запятая<br><br><br></p>

<p><strong>Ответ:</strong> 0,9</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0,9</td>
  <td style="text-align:right;">20</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>0.9</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q14" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 14
            <a class="anchor-link" aria-label="Anchor" href="#q14">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>По поведению математические модели во времени принято разделять на *** и динамические.<br><br>В ответ запишите слово с учетом падежа. Пример: стохастические<br><br><br></p>

<p><strong>Ответ:</strong> статические</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>статические</td>
  <td style="text-align:right;">17</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>статичные</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q15" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 15
            <a class="anchor-link" aria-label="Anchor" href="#q15">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>3</td>
              <td>

                    C

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>D</li>

        <li>A</li>

        <li>B</li>

        <li>C</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>3
            <ul>

                <li>C (выбрали 21, верный ответ)</li>

                <li>B (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 21, верный ответ)</li>

                <li>C (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>D (выбрали 22, верный ответ)</li>

            </ul>
        </li>

        <li>2
            <ul>

                <li>A (выбрали 22, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q16" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 16
            <a class="anchor-link" aria-label="Anchor" href="#q16">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>4</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>

                    C

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>C</li>

        <li>D</li>

        <li>A</li>

        <li>B</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>C (выбрали 18, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>D (выбрали 18, верный ответ)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>A (выбрали 18, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 18, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q17" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 17
            <a class="anchor-link" aria-label="Anchor" href="#q17">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Установите соответствие между объектами:<br><br>1<br><br>метод наименьших квадратов<br><br>A<br><br>Классификация<br><br>2<br><br>метод K-means<br><br>B<br><br>Регрессия<br><br>3<br><br>медианные значения<br><br>C<br><br>Кластеризация<br><br>4<br><br>метод k-ближайших соседей<br><br>D<br><br>Подготовка данных<br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>2</td>
              <td>

                    C

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>B</li>

        <li>D</li>

        <li>A</li>

        <li>C</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>4
            <ul>

                <li>A (выбрали 23, верный ответ)</li>

                <li>C (выбрали 1, правильность неизвестна)</li>

                <li>D (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 24, верный ответ)</li>

                <li>A (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>D (выбрали 24, верный ответ)</li>

                <li>A (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>2
            <ul>

                <li>C (выбрали 24, верный ответ)</li>

                <li>B (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q18" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 18
            <a class="anchor-link" aria-label="Anchor" href="#q18">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Для нахождения чего именно используется обратный ход в алгоритме Дейкстры?<br><br>Ответ запишите в именительном падеже с маленькой буквы.<br><br>Пример: вес графа<br><br><br></p>

<p><strong>Ответ:</strong> кратчайший путь</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>вес графа</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>кратчайший путь</td>
  <td style="text-align:right;">17</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>для восстановления кратчайшего пути</td>
  <td style="text-align:right;">2</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>кратчайший путь</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q19" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 19
            <a class="anchor-link" aria-label="Anchor" href="#q19">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Какая библиотека Python часто используется для анализа временных рядов?<br><br>Пример ответа: numpy<br><br><br></p>

<p><strong>Ответ:</strong> statsmodels</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>numpy</td>
  <td style="text-align:right;">2</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>statsmodels</td>
  <td style="text-align:right;">27</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>pandas</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q20" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 20
            <a class="anchor-link" aria-label="Anchor" href="#q20">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Заполните пропуск:<br><br>При анализе временных рядов нередко приходится проводить сглаживание по методу *** средней.<br><br><br></p>

<p><strong>Ответ:</strong> скользящей</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>обратно скользящей</td>
  <td style="text-align:right;">2</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>скользящей</td>
  <td style="text-align:right;">14</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q21" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 21
            <a class="anchor-link" aria-label="Anchor" href="#q21">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 1010</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>1010</td>
  <td style="text-align:right;">21</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>1000</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>10</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q22" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 22
            <a class="anchor-link" aria-label="Anchor" href="#q22">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Чему равно математическое ожидание равномерно распределенных случайных величин из интервала от -2 до +4?<br><br>В ответ запишите целое число или десятичную дробь, разделитель разрядов запятая.<br><br><br></p>

<p><strong>Ответ:</strong> 1</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>1</td>
  <td style="text-align:right;">25</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q23" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 23
            <a class="anchor-link" aria-label="Anchor" href="#q23">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Во временных рядах - это статистический показатель, который измеряет разброс значений временного ряда относительно его среднего значения.<br><br>В ответ запишите слово с маленькой буквы.<br>Пример: автокорреляция<br><br><br></p>

<p><strong>Ответ:</strong> дисперсия</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>дисперсия</td>
  <td style="text-align:right;">5</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q24" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 24
            <a class="anchor-link" aria-label="Anchor" href="#q24">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>4</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>

                    C

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>B</li>

        <li>D</li>

        <li>A</li>

        <li>C</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>4
            <ul>

                <li>D (выбрали 22, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 22, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>A (выбрали 23, верный ответ)</li>

            </ul>
        </li>

        <li>2
            <ul>

                <li>C (выбрали 22, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q25" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 25
            <a class="anchor-link" aria-label="Anchor" href="#q25">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Установите соответствие между объектами:<br><br>1<br><br>обучение с учителем<br><br>A<br><br>Кластеризация<br><br>2<br><br>обучение без учителя<br><br>B<br><br>Регрессия<br><br>3<br><br>подготовка данных<br><br>C<br><br>Заполнение пропусков<br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>3</td>
              <td>

                    C

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>A</li>

        <li>C</li>

        <li>B</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>A (выбрали 23, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>C (выбрали 23, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 23, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q26" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 26
            <a class="anchor-link" aria-label="Anchor" href="#q26">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 1</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>1</td>
  <td style="text-align:right;">24</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q27" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 27
            <a class="anchor-link" aria-label="Anchor" href="#q27">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 3</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>3</td>
  <td style="text-align:right;">11</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q28" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 28
            <a class="anchor-link" aria-label="Anchor" href="#q28">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Сколько бит в 1 килобайте?<br><br><br></p>

<p><strong>Ответ:</strong> 8192</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>8192</td>
  <td style="text-align:right;">18</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q29" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 29
            <a class="anchor-link" aria-label="Anchor" href="#q29">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 5</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>6</td>
  <td style="text-align:right;">14</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>5</td>
  <td style="text-align:right;">5</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q30" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 30
            <a class="anchor-link" aria-label="Anchor" href="#q30">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Иконка на рабочем столе имеет разрешение 32Х32 пикселя, на кодирование каждого пикселя отводится 16 бит. Найдите, сколько бит нужно отвести на кодирование одной иконки?<br><br><br></p>

<p><strong>Ответ:</strong> 16384</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>16384</td>
  <td style="text-align:right;">25</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q31" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 31
            <a class="anchor-link" aria-label="Anchor" href="#q31">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Переведите число 37 из десятичной системы счисления в двоичную.<br><br><br></p>

<p><strong>Ответ:</strong> 100101</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>100101</td>
  <td style="text-align:right;">19</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>1001101</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q32" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 32
            <a class="anchor-link" aria-label="Anchor" href="#q32">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 0,8</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0,8</td>
  <td style="text-align:right;">23</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>2,5</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q33" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 33
            <a class="anchor-link" aria-label="Anchor" href="#q33">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 3</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>3</td>
  <td style="text-align:right;">14</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>3,25</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q34" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 34
            <a class="anchor-link" aria-label="Anchor" href="#q34">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br>Соотнесите каждый из методов с соответствующим описанием<br><br><br><br><br><br>1. Классификация K-ближайших соседей<br><br>2. Метод наименьших квадратов<br><br>3. Агломеративная кластеризация<br><br>4. Множественная регрессия<br><br><br><br><br>A. Метод, используемый для группировки данных без предварительной разметки.<br><br>B. Метод, используемый для классификации объектов по заранее размеченным данным.<br><br>C. Метод, применяемый для построения регрессионной модели, где параметры определяются путем минимизации суммы квадратов ошибок.<br><br>D. Метод, применяемый для построения регрессионной модели с несколькими предикторами для предсказания количественных значений.<br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>2</td>
              <td>

                    С

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    A

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>D</li>

        <li>B</li>

        <li>A</li>

        <li>С</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>С (выбрали 27, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 27, верный ответ)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>D (выбрали 27, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>A (выбрали 27, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q35" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 35
            <a class="anchor-link" aria-label="Anchor" href="#q35">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 4</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>4</td>
  <td style="text-align:right;">15</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>0,5</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>5</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q36" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 36
            <a class="anchor-link" aria-label="Anchor" href="#q36">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Как называется последовательность наблюдений некоторого признака Y в различные, чаще всего равноотстоящие моменты времени.<br><br>Пример: коэффициент заложенности<br><br><br></p>

<p><strong>Ответ:</strong> временной ряд</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>Временный ряд</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>временной ряд</td>
  <td style="text-align:right;">14</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q37" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 37
            <a class="anchor-link" aria-label="Anchor" href="#q37">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Найдите расстояние между кодами: 11100 и 11001<br><br><br></p>

<p><strong>Ответ:</strong> 2</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>2</td>
  <td style="text-align:right;">10</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q38" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 38
            <a class="anchor-link" aria-label="Anchor" href="#q38">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Сколько бит потребуется для кодирования игральных карт стандартной колоды из 36 карт?<br><br><br></p>

<p><strong>Ответ:</strong> 6</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>6</td>
  <td style="text-align:right;">13</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q39" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 39
            <a class="anchor-link" aria-label="Anchor" href="#q39">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответы:</strong></p>
    <ul>

        <li>да</li>

        <li>Да</li>

    </ul>


<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>да</td>
  <td style="text-align:right;">4</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>Да</td>
  <td style="text-align:right;">18</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q40" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 40
            <a class="anchor-link" aria-label="Anchor" href="#q40">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 0</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0</td>
  <td style="text-align:right;">24</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q41" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 41
            <a class="anchor-link" aria-label="Anchor" href="#q41">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>D</td>
              <td>

                    4

              </td>
            </tr>

            <tr>
              <td>A</td>
              <td>

                    2

              </td>
            </tr>

            <tr>
              <td>B</td>
              <td>

                    1

              </td>
            </tr>

            <tr>
              <td>C</td>
              <td>

                    3

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>1</li>

        <li>4</li>

        <li>3</li>

        <li>2</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>D
            <ul>

                <li>4 (выбрали 9, верный ответ)</li>

            </ul>
        </li>

        <li>A
            <ul>

                <li>2 (выбрали 9, верный ответ)</li>

            </ul>
        </li>

        <li>B
            <ul>

                <li>1 (выбрали 9, верный ответ)</li>

            </ul>
        </li>

        <li>C
            <ul>

                <li>3 (выбрали 9, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q42" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 42
            <a class="anchor-link" aria-label="Anchor" href="#q42">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 2</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>2</td>
  <td style="text-align:right;">14</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>8</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>1</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q43" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 43
            <a class="anchor-link" aria-label="Anchor" href="#q43">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>3</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    C

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    B

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>A</li>

        <li>C</li>

        <li>D</li>

        <li>B</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>3
            <ul>

                <li>D (выбрали 22, верный ответ)</li>

                <li>A (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>2
            <ul>

                <li>A (выбрали 22, верный ответ)</li>

                <li>D (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>C (выбрали 23, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>B (выбрали 23, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q44" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 44
            <a class="anchor-link" aria-label="Anchor" href="#q44">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Как называется метод анализа, при котором временной ряд разлагается на отдельные компоненты?<br><br>В ответе запишите слово с заглавной буквы.<br><br>Пример: Дисперсия<br><br><br></p>

<p><strong>Ответ:</strong> Декомпозиция</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>Декомпозиция</td>
  <td style="text-align:right;">16</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>спектральный анализ</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q45" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 45
            <a class="anchor-link" aria-label="Anchor" href="#q45">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 1</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>1</td>
  <td style="text-align:right;">14</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>0</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q46" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 46
            <a class="anchor-link" aria-label="Anchor" href="#q46">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>В</td>
              <td>

                    1

              </td>
            </tr>

            <tr>
              <td>А</td>
              <td>

                    2

              </td>
            </tr>

            <tr>
              <td>С</td>
              <td>

                    3

              </td>
            </tr>

            <tr>
              <td>D</td>
              <td>

                    4

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>3</li>

        <li>1</li>

        <li>2</li>

        <li>4</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>В
            <ul>

                <li>1 (выбрали 4, верный ответ)</li>

            </ul>
        </li>

        <li>А
            <ul>

                <li>2 (выбрали 4, верный ответ)</li>

            </ul>
        </li>

        <li>С
            <ul>

                <li>3 (выбрали 4, верный ответ)</li>

            </ul>
        </li>

        <li>D
            <ul>

                <li>4 (выбрали 4, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q47" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 47
            <a class="anchor-link" aria-label="Anchor" href="#q47">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Сколько бит нужно отвести на кодирование двузначного десятеричного числа?<br><br><br></p>

<p><strong>Ответ:</strong> 7</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>4</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>7</td>
  <td style="text-align:right;">20</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q48" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 48
            <a class="anchor-link" aria-label="Anchor" href="#q48">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 111</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>111</td>
  <td style="text-align:right;">23</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q49" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 49
            <a class="anchor-link" aria-label="Anchor" href="#q49">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>

<p><strong>Ответ:</strong> 122,5</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>122,5</td>
  <td style="text-align:right;">15</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>120</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>117,5</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q50" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 50
            <a class="anchor-link" aria-label="Anchor" href="#q50">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Сопоставьте системы исчисления с их характеристиками:<br><br> 1. Двоичная система<br> 2. Десятичная система<br> 3. Шестнадцатеричная система<br> 4. Восьмеричная система<br><br>А.&nbsp;Использует 8 символов (0-7) для представления чисел.<br>В.&nbsp;Основная система счисления, используемая в повседневной жизни, использует 10 символов (0-9).<br>С.&nbsp;Использует 2 символа (0 и 1) и широко применяется в компьютерах.<br>D.&nbsp;Использует 16 символов (0-9 и A-F) для компактного представления двоичных данных.<br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>2</td>
              <td>

                    В

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    С

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    D

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>A</li>

        <li>D</li>

        <li>С</li>

        <li>В</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>В (выбрали 11, верный ответ)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>A (выбрали 11, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>С (выбрали 11, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>D (выбрали 11, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q51" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 51
            <a class="anchor-link" aria-label="Anchor" href="#q51">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 18</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>18</td>
  <td style="text-align:right;">17</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q52" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 52
            <a class="anchor-link" aria-label="Anchor" href="#q52">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>В предположении, что в трех идущих подряд битах не может быть более одной ошибки, восстановите исходное сообщение, если получено было следующее сообщение: 001011101010<br>Ответ представьте в виде двоичного кода<br>Пример: 1101<br><br><br></p>

<p><strong>Ответ:</strong> 0110</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0110</td>
  <td style="text-align:right;">11</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>00100001010</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

<tr>
  <td>001011101010</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q53" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 53
            <a class="anchor-link" aria-label="Anchor" href="#q53">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Чему равно математическое ожидание равномерно распределенных случайных величин из интервала от -1 до +1?<br><br><br></p>

<p><strong>Ответ:</strong> 0</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>0</td>
  <td style="text-align:right;">13</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q54" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 54
            <a class="anchor-link" aria-label="Anchor" href="#q54">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Как называется метод прогнозирования, в котором проводится вычисление ошибки моделирования и модификации исходной модели с четом этой ошибки.<br><br>В ответ укажите название метода в именительном падеже с маленькой буквы.<br><br>Пример: комбинаторный<br><br><br></p>

<p><strong>Ответ:</strong> адаптивный</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>адаптивный</td>
  <td style="text-align:right;">15</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>дифференциальный</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q55" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 55
            <a class="anchor-link" aria-label="Anchor" href="#q55">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Во временных рядах - это статистический показатель, который измеряет разброс значений временного ряда относительно его среднего значения.<br><br>В ответ запишите слово с маленькой буквы.<br>Пример: автокорреляция<br><br><br></p>

<p><strong>Ответ:</strong> дисперсия</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>дисперсия</td>
  <td style="text-align:right;">18</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q56" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 56
            <a class="anchor-link" aria-label="Anchor" href="#q56">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Сопоставьте термины с их определениями:<br><br> 1. Обучение с учителем<br> 2. Обучение без учителя<br> 3. Обучение с подкреплением<br>    <br><br>А.&nbsp; Процесс, при котором модель учится на размеченных данных<br>В. Процесс, при котором модель учится находить структуры в неразмеченных данных.<br>С.&nbsp;Метод, при котором агент учится принимать решения, получая награды или штрафы.<br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>2</td>
              <td>

                    В

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    А

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    С

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>С</li>

        <li>В</li>

        <li>А</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>В (выбрали 18, верный ответ)</li>

                <li>С (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>А (выбрали 19, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>С (выбрали 18, верный ответ)</li>

                <li>В (выбрали 1, правильность неизвестна)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q57" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 57
            <a class="anchor-link" aria-label="Anchor" href="#q57">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p>Какому типу соответствие уравнение теплопроводности&nbsp;<br><br>В ответ укажите название типа в именительном падеже с маленькой буквы.<br><br>Пример: адиабатический<br><br><br></p>

<p><strong>Ответ:</strong> параболический</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>параболический</td>
  <td style="text-align:right;">17</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>параболическое</td>
  <td style="text-align:right;">1</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q58" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 58
            <a class="anchor-link" aria-label="Anchor" href="#q58">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p></p>

<p><strong>Ответ:</strong> -2</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>-2</td>
  <td style="text-align:right;">13</td>
  <td>верный ответ</td>
</tr>

<tr>
  <td>-1</td>
  <td style="text-align:right;">2</td>
  <td>правильность неизвестна</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q59" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 59
            <a class="anchor-link" aria-label="Anchor" href="#q59">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>

<p><strong>Ответ:</strong> 5</p>

<p>Статистика: </p>


<table class="table table-bordered table-striped">
<thead>
<tr>
  <th>Вариант ответа</th>
  <th style="text-align:right;">Выбрали этот вариант</th>
  <th>Правильность</th>
</tr>
</thead>
<tbody>

<tr>
  <td>5</td>
  <td style="text-align:right;">16</td>
  <td>верный ответ</td>
</tr>

</tbody>
</table>


    </div>

</div>
            </div>


            <div class="row">


<div id="q60" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 60
            <a class="anchor-link" aria-label="Anchor" href="#q60">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>2</td>
              <td>

                    B

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    C

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    A

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    D

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>D</li>

        <li>A</li>

        <li>B</li>

        <li>C</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>B (выбрали 6, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>C (выбрали 6, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>A (выбрали 6, верный ответ)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>D (выбрали 6, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


            <div class="row">


<div id="q61" class="card col-md-7 mb-4 mx-auto px-0">
    <div class="card-header">
        <h5 class="card-title">
            Вопрос 61
            <a class="anchor-link" aria-label="Anchor" href="#q61">

            </a>
        </h5>
    </div>
    <div class="card-body">

            <p><br><br><br></p>
            <table class="table table-bordered table-striped">
    <thead>
        <tr>
          <th>Левая часть</th>
          <th>Правая часть</th>
        </tr>
    </thead>
    <tbody>

            <tr>
              <td>2</td>
              <td>

                    С

              </td>
            </tr>

            <tr>
              <td>1</td>
              <td>

                    А

              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>

                    D

              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>

                    B

              </td>
            </tr>

    </tbody>
</table>

<p>Варианты правой части:</p>

<ul>

        <li>D</li>

        <li>А</li>

        <li>С</li>

        <li>B</li>

</ul>

<p>Статистика:</p>


<ul>

        <li>2
            <ul>

                <li>С (выбрали 17, верный ответ)</li>

            </ul>
        </li>

        <li>1
            <ul>

                <li>А (выбрали 17, верный ответ)</li>

            </ul>
        </li>

        <li>3
            <ul>

                <li>D (выбрали 17, верный ответ)</li>

            </ul>
        </li>

        <li>4
            <ul>

                <li>B (выбрали 17, верный ответ)</li>

            </ul>
        </li>

</ul>


    </div>

</div>
            </div>


    <p>
    </p></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async="" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" integrity="sha512-D9gUyxqja7hBtkWpPWGt9wfbfaMGVt9gnyCvYa+jojwwPHLCzUm5i8rpk7vD7wNee9bA35eYIjobYPaQuKS1MQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js"></script>
<script src="https://unpkg.com/highlightjs-copy/dist/highlightjs-copy.min.js"></script>
<script>
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
    hljs.addPlugin(new CopyButtonPlugin());
</script>


  </div>
</div>
        `);
});

app.get("/cron", async (_, res) => {
    try {
        await freezeKeys();
        await notifyExpiration();
        await findJobsAbove400();
        return res.send("*** MANUAL JOB COMPLETE ***");
    } catch (error) {
        await reportError(error);
        return res.send("*** MANUAL JOB FAILED ***");
    }
});

app.use("/public", express.static("public"));

const protectedRouter = Router();

protectedRouter.use(TMA_authMiddleware);

protectedRouter.use(usersRouter);
protectedRouter.use(keysRouter);
protectedRouter.use(paymentRouter);
protectedRouter.use(referralRouter);

app.use(protectedRouter);

app.use(defaultErrorMiddleware);

if (config.port === 443) {
    if (!config.SSLCertPath || !config.SSLKeyPath) {
        throw Error("SSL config missing...");
    }
    https.createServer({ cert: fs.readFileSync(config.SSLCertPath), key: fs.readFileSync(config.SSLKeyPath) }, app).listen(config.port, async () => {
        console.log(`HTTPS server is running on port ${config.port}...`);
    });
} else {
    http.createServer(app).listen(config.port, async () => {
        console.log(`HTTP server is running on port ${config.port}...`);
    });
}
