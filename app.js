const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

let MYport;

SerialPort.list((err, ports) => {
  ports.forEach(port => {
    console.log(port);
    if (port.pnpId == "ACPI\\PNP0501\\0") {
      console.log("Found It");
      MYport = port.comName.toString();
      console.log(MYport);
    }
  });

  const port = new SerialPort(MYport, {
    baudRate: 19200,
    autoOpen: false
  });

  const parser = new Readline();
  port.pipe(parser);
  parser.on("data", line => console.log(`line> ${line}`));
  parser.on("error", error => console.log(`error> ${error}`));

  port.open(error => {
    console.log("OPEN");
    console.log(error);
    port.write("CASH_TOTALBLOCKING 0\r\n");
  });
});
