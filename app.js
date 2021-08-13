const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

let comPort;

SerialPort.list((err, ports) => {

  /**
   * Find COM port
   */

  ports.forEach(port => {
    console.log(port);
    if (port.pnpId == "ACPI\\PNP0501\\0") {
      console.log("Found It");
      comPort = port.comName.toString();
      console.log(comPort);
    }
  });

  /**
   * COM port configs
   */

  const port = new SerialPort(comPort, {
    baudRate: 19200,
    autoOpen: false
  });

  let totalMoney = 0;
  const parser = new Readline();
  port.pipe(parser);
  parser.on("data", line => {
    console.log(`> ${line}`);
    readMoney(line);
  });
  parser.on("error", error => console.log(`error> ${error}`));

  port.open(error => {
    console.log("OPEN");
    console.log(error);
    port.write("CASH_TOTALBLOCKING 0\r\n");
  });

  /**
   * Interface read input physical money and return the value
   */
  const readMoney = money => {
    const found = money.includes("IN=");

    if (found) {
      const readInput = money.split("=");
      let key = null;
      let value = null;

      if (readInput && readInput.length) {
        key = readInput[0];
        value = readInput[1];
      }

      const moneyConverted = parseFloat(value / 100).toFixed(2);
      totalMoney = totalMoney + Number(moneyConverted);
      let total = totalMoney.toFixed(2);

      console.log("\nLOADED: " + moneyConverted + " €\n");
      console.log("ACCOUNT BALANCE: " + total + " €");
      return moneyConverted;
    }
  };
});
