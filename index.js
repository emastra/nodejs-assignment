const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;
