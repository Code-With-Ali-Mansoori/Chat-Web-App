import express from "express";

export const welcome_sockets = ( req : express.Request , res : express.Response ) => {
    res.render('welcome');
};

export const chat_sockets = ( req : express.Request ,res : express.Response ) => {
    res.render('chat')
};