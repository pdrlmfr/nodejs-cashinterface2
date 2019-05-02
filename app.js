const SerialPort = require("serialport");

const portname = "COM1";

const Readline = require("@serialport/parser-readline");
const port = new SerialPort(portname, {
  baudRate: 19200
});

const parser = new Readline();
port.pipe(parser);

parser.on("data", line => console.log(`line> ${line}`));
parser.on("error", error => console.log(`error> ${error}`));

port.write("CASH_TOTALBLOCKING 0");
console.log("--END--");
