import { InitData } from "@telegram-apps/init-data-node";
import { Response } from "express";
import { Context } from "grammy";
import "express";

export interface CustomResponse extends Response {
    locals: {
        initData?: InitData;
    };
}

export type MyContext = Context;
