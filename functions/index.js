const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mail = require("@sendgrid/mail");

admin.initializeApp();
mail.setApiKey(
    "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",
);


const apiKey = "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";
const apiKey2 = "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";
const apiKey3 = "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";

const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const checkAndSetIrrigationState = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentDay = normalizeText(
        new Date().toLocaleString("es-DO", {
          weekday: "long",
          ...options,
        }).toLowerCase(),
    );
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const docRef = db.collection("RiegoN1").doc("schedule1");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const selectedDays = data.selectedDays || [];
      const normalizedSelectedDays = selectedDays.map((day) =>
        normalizeText(day),
      );

      if (normalizedSelectedDays.includes(currentDay)) {
        const wateringTime = data.wateringTime;
        const [wateringHour, wateringMinute] =
          wateringTime
              .split(":")
              .map(Number);
        const [currentHour, currentMinute] =
          currentHourString
              .split(":")
              .map(Number);

        if (wateringHour === currentHour &&
          wateringMinute === currentMinute) {
          const currentState = data.state;
          if (currentState !== "on") {
            await docRef.set({state: "on"}, {merge: true});
          }
        } else {
          await docRef.set({state: "off"}, {merge: true});
        }
      } else {
        await docRef.set({state: "off"}, {merge: true});
      }
    } else {
      console.log("No se encontró la programación de riego en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar y establecer el estado de riego:", error);
  }
};

const checkAndSetLightState = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const docRef = db.collection("LuzN1").doc("schedule1");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const turnOnTime = data.turnOnTime;
      const turnOffTime = data.turnOffTime;
      const [turnOnHour, turnOnMinute] =
        turnOnTime.split(":").map(Number);
      const [turnOffHour, turnOffMinute] =
        turnOffTime.split(":").map(Number);
      const [currentHour, currentMinute] =
        currentHourString.split(":").map(Number);

      if (currentHour === turnOnHour && currentMinute === turnOnMinute) {
        await docRef.set({state: "on"}, {merge: true});
      } else if ((currentHour > turnOffHour) || (currentHour ===
        turnOffHour && currentMinute >= turnOffMinute)) {
        await docRef.set({state: "off"}, {merge: true});
      } else if (currentHour > turnOnHour || (currentHour ===
        turnOnHour && currentMinute > turnOnMinute)) {
        await docRef.set({state: "on"}, {merge: true});
      } else {
        // Do nothing
      }
    } else {
      console.log("No se encontró la programación de luz en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar y establecer el estado de luz:", error);
  }
};

const checkAndSetLightState2 = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const docRef = db.collection("LuzN2").doc("schedule1");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const turnOnTime = data.turnOnTime;
      const turnOffTime = data.turnOffTime;
      const [turnOnHour, turnOnMinute] =
        turnOnTime.split(":").map(Number);
      const [turnOffHour, turnOffMinute] =
        turnOffTime.split(":").map(Number);
      const [currentHour, currentMinute] =
        currentHourString.split(":").map(Number);

      if (currentHour === turnOnHour && currentMinute === turnOnMinute) {
        await docRef.set({state: "on"}, {merge: true});
      } else if ((currentHour > turnOffHour) || (currentHour ===
        turnOffHour && currentMinute >= turnOffMinute)) {
        await docRef.set({state: "off"}, {merge: true});
      } else if (currentHour > turnOnHour || (currentHour ===
        turnOnHour && currentMinute > turnOnMinute)) {
        await docRef.set({state: "on"}, {merge: true});
      } else {
        // Do nothing
      }
    } else {
      console.log("No se encontró la programación de luz en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar y establecer el estado de luz:", error);
  }
};

const checkAndSetLightState3 = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const docRef = db.collection("LuzN3").doc("schedule1");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const turnOnTime = data.turnOnTime;
      const turnOffTime = data.turnOffTime;
      const [turnOnHour, turnOnMinute] =
        turnOnTime.split(":").map(Number);
      const [turnOffHour, turnOffMinute] =
        turnOffTime.split(":").map(Number);
      const [currentHour, currentMinute] =
        currentHourString.split(":").map(Number);

      if (currentHour === turnOnHour && currentMinute === turnOnMinute) {
        await docRef.set({state: "on"}, {merge: true});
      } else if ((currentHour > turnOffHour) || (currentHour ===
        turnOffHour && currentMinute >= turnOffMinute)) {
        await docRef.set({state: "off"}, {merge: true});
      } else if (currentHour > turnOnHour || (currentHour ===
        turnOnHour && currentMinute > turnOnMinute)) {
        await docRef.set({state: "on"}, {merge: true});
      } else {
        // Do nothing
      }
    } else {
      console.log("No se encontró la programación de luz en Firestore.");
    }
  } catch (error) {
    console.error("Error al verificar y establecer el estado de luz:", error);
  }
};

const getPlantName = async (index) => {
  const db = admin.firestore();
  try {
    const docRef = db.collection("plantNamesN1").doc(`plant${index}`);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data().name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo el nombre de la planta:", error);
    return null;
  }
};

const getPlantName2 = async (index) => {
  const db = admin.firestore();
  try {
    const docRef = db.collection("plantNamesN2").doc(`plant${index}`);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data().name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo el nombre de la planta:", error);
    return null;
  }
};

const getPlantName3 = async (index) => {
  const db = admin.firestore();
  try {
    const docRef = db.collection("plantNamesN3").doc(`plant${index}`);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data().name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo el nombre de la planta:", error);
    return null;
  }
};


const saveMessage = async (sender, message) => {
  try {
    const db = admin.firestore();
    const timestamp = new Date();
    const docRef = db.collection("chatHistory")
        .doc(timestamp.getTime().toString());
    await docRef.set({
      sender: sender,
      message: message,
      timestamp: timestamp,
    });
    console.log("Mensaje guardado correctamente en Firestore");
  } catch (error) {
    console.error("Error al guardar el mensaje en Firestore:", error);
  }
};

const saveMessage2 = async (sender, message) => {
  try {
    const db = admin.firestore();
    const timestamp = new Date();
    const docRef = db.collection("chatHistoryN2")
        .doc(timestamp.getTime().toString());
    await docRef.set({
      sender: sender,
      message: message,
      timestamp: timestamp,
    });
    console.log("Mensaje guardado correctamente en Firestore");
  } catch (error) {
    console.error("Error al guardar el mensaje en Firestore:", error);
  }
};

const saveMessage3 = async (sender, message) => {
  try {
    const db = admin.firestore();
    const timestamp = new Date();
    const docRef = db.collection("chatHistoryN3")
        .doc(timestamp.getTime().toString());
    await docRef.set({
      sender: sender,
      message: message,
      timestamp: timestamp,
    });
    console.log("Mensaje guardado correctamente en Firestore");
  } catch (error) {
    console.error("Error al guardar el mensaje en Firestore:", error);
  }
};

const sendAlertEmail = async (emails, subject, message) => {
  const msg = {
    to: emails,
    from: "alertgreensense@gmail.com",
    subject: subject,
    text: message,
  };

  try {
    await mail.sendMultiple(msg);
    console.log("Alert emails sent successfully");
  } catch (error) {
    console.error("Error sending alert emails:", error);
  }
};

const getUserEmails = async () => {
  try {
    const db = admin.database();
    const snapshot = await db.ref("UsersAuthList").once("value");
    const users = snapshot.val();
    const emails = users ? Object.values(users).map((user) => user.email) : [];
    return emails;
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return [];
  }
};

const sendTemperatureAlertEmail = async (emails, temperature) => {
  const subject = "Alerta: Temperatura del sensor superó el límite";
  const message = `La temperatura reciente del sensor ha\n\n` +
  `superado el límite establecido:\n\n` +
    `Temperatura: ${temperature} °C`;
  await sendAlertEmail(emails, subject, message);
};

const sendHumidityAlertEmail = async (emails, humidity) => {
  const subject = "Alerta: Humedad del sensor superó el límite";
  const message = `La humedad reciente del sensor ha\n\n`+
  ` superado el límite establecido:\n\n` +
    `Humedad: ${humidity} %`;
  await sendAlertEmail(emails, subject, message);
};


const checkSensorLimits = async () => {
  try {
    const db = admin.firestore();

    // Obtener los datos del sensor más recientes
    const sensorDataCollection = db.collection("sensors_dataN1");
    const query = sensorDataCollection.orderBy("date", "desc").limit(1);
    const querySnapshot = await query.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();

      const temperatureLimit = 30;
      const humidityLimit = 90;

      if (data.temperature > temperatureLimit) {
        const temperatureEmails = await getUserEmails();
        if (temperatureEmails.length > 0) {
          await sendTemperatureAlertEmail(temperatureEmails, data.temperature);
        }
      }

      if (data.humidity > humidityLimit) {
        const humidityEmails = await getUserEmails();
        if (humidityEmails.length > 0) {
          await sendHumidityAlertEmail(humidityEmails, data.humidity);
        }
      }
    });
  } catch (error) {
    console.error("Error al verificar los límites del sensor:", error);
  }
};

const checkSensorLimits2 = async () => {
  try {
    const db = admin.firestore();

    // Obtener los datos del sensor más recientes
    const sensorDataCollection = db.collection("sensors_dataN2");
    const query = sensorDataCollection.orderBy("date", "desc").limit(1);
    const querySnapshot = await query.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();

      const temperatureLimit = 30;
      const humidityLimit = 90;

      if (data.temperature > temperatureLimit) {
        const temperatureEmails = await getUserEmails();
        if (temperatureEmails.length > 0) {
          await sendTemperatureAlertEmail(temperatureEmails, data.temperature);
        }
      }

      if (data.humidity > humidityLimit) {
        const humidityEmails = await getUserEmails();
        if (humidityEmails.length > 0) {
          await sendHumidityAlertEmail(humidityEmails, data.humidity);
        }
      }
    });
  } catch (error) {
    console.error("Error al verificar los límites del sensor:", error);
  }
};

const checkSensorLimits3 = async () => {
  try {
    const db = admin.firestore();

    // Obtener los datos del sensor más recientes
    const sensorDataCollection = db.collection("sensors_dataN3");
    const query = sensorDataCollection.orderBy("date", "desc").limit(1);
    const querySnapshot = await query.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();

      const temperatureLimit = 30;
      const humidityLimit = 90;

      if (data.temperature > temperatureLimit) {
        const temperatureEmails = await getUserEmails();
        if (temperatureEmails.length > 0) {
          await sendTemperatureAlertEmail(temperatureEmails, data.temperature);
        }
      }

      if (data.humidity > humidityLimit) {
        const humidityEmails = await getUserEmails();
        if (humidityEmails.length > 0) {
          await sendHumidityAlertEmail(humidityEmails, data.humidity);
        }
      }
    });
  } catch (error) {
    console.error("Error al verificar los límites del sensor:", error);
  }
};

const getSensorData = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const pHDataCollection = db.collection("sensor_Ph");
    const pHQuery = pHDataCollection.orderBy("date", "desc").limit(1);
    const pHQuerySnapshot = await pHQuery.get();
    let pH = null;
    pHQuerySnapshot.forEach((doc) => {
      pH = doc.data().pH;
    });


    const sensorDataCollection = db.collection("sensors_dataN1");
    const q = sensorDataCollection.orderBy("date", "desc").limit(1);

    const querySnapshot = await q.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const timestamp = new Date();
      const formattedDate = timestamp.toLocaleDateString("es-DO", options);

      const plantName1 = await getPlantName(1);
      const plantName2 = await getPlantName(2);
      const plantName3 = await getPlantName(3);

      const ultimosDatosSensores = `Los datos de los sensores:\n` +
        `Temperatura: ${data.temperature} °C\n` +
        `Humedad: ${data.humidity} %\n` +
        `Humedad de la planta ${plantName1}: ${data.moisture} %\n` +
        `Humedad de la planta ${plantName2}: ${data.moisture2} %\n` +
        `Humedad de la planta ${plantName3}: ${data.moisture} %\n` +
        `Luz: ${((500 / data.lux).toFixed(2))*1000 } lux\n` +
        `pH: ${pH}\n` +
        `Fecha: ${formattedDate} \n` +
        `Hora: ${currentHourString}`;


      await saveMessage("Sensors", ultimosDatosSensores);

      if (ultimosDatosSensores) {
        const mensajeAI = `Los datos de los sensores: 
        ${JSON.stringify(ultimosDatosSensores)}`;


        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: mensajeAI}],
            max_tokens: 150,
          }),
        });


        if (!response.ok) {
          console.error("Error al solicitar respuesta de la IA:"
              , response.status);
          return;
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error);
  }
};

const getSensorData2 = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const pHDataCollection = db.collection("sensor_Ph");
    const pHQuery = pHDataCollection.orderBy("date", "desc").limit(1);
    const pHQuerySnapshot = await pHQuery.get();
    let pH = null;
    pHQuerySnapshot.forEach((doc) => {
      pH = doc.data().pH;
    });


    const sensorDataCollection = db.collection("sensors_dataN2");
    const q = sensorDataCollection.orderBy("date", "desc").limit(1);

    const querySnapshot = await q.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const timestamp = new Date();
      const formattedDate = timestamp.toLocaleDateString("es-DO", options);

      const plantName1 = await getPlantName2(1);
      const plantName2 = await getPlantName2(2);
      const plantName3 = await getPlantName2(3);

      const ultimosDatosSensores = `Los datos de los sensores:\n` +
        `Temperatura: ${data.temperature} °C\n` +
        `Humedad: ${data.humidity} %\n` +
        `Humedad de la planta ${plantName1}: ${data.moisture} %\n` +
        `Humedad de la planta ${plantName2}: ${data.moisture2} %\n` +
        `Humedad de la planta ${plantName3}: ${data.moisture} %\n` +
        `Luz: ${((500 / data.lux).toFixed(2))*1000 } lux\n` +
        `pH: ${pH}\n` +
        `Fecha: ${formattedDate} \n` +
        `Hora: ${currentHourString}`;


      await saveMessage2("Sensors", ultimosDatosSensores);

      if (ultimosDatosSensores) {
        const mensajeAI = `Los datos de los sensores: 
        ${JSON.stringify(ultimosDatosSensores)}`;


        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey2}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: mensajeAI}],
            max_tokens: 150,
          }),
        });


        if (!response.ok) {
          console.error("Error al solicitar respuesta de la IA:"
              , response.status);
          return;
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error);
  }
};

const getSensorData3 = async () => {
  try {
    const db = admin.firestore();
    const options = {timeZone: "America/Santo_Domingo"};
    const currentHourString = new Date().toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...options,
    });

    const pHDataCollection = db.collection("sensor_Ph");
    const pHQuery = pHDataCollection.orderBy("date", "desc").limit(1);
    const pHQuerySnapshot = await pHQuery.get();
    let pH = null;
    pHQuerySnapshot.forEach((doc) => {
      pH = doc.data().pH;
    });


    const sensorDataCollection = db.collection("sensors_dataN3");
    const q = sensorDataCollection.orderBy("date", "desc").limit(1);

    const querySnapshot = await q.get();

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const timestamp = new Date();
      const formattedDate = timestamp.toLocaleDateString("es-DO", options);

      const plantName1 = await getPlantName3(1);
      const plantName2 = await getPlantName3(2);
      const plantName3 = await getPlantName3(3);

      const ultimosDatosSensores = `Los datos de los sensores:\n` +
        `Temperatura: ${data.temperature} °C\n` +
        `Humedad: ${data.humidity} %\n` +
        `Humedad de la planta ${plantName1}: ${data.moisture} %\n` +
        `Humedad de la planta ${plantName2}: ${data.moisture2} %\n` +
        `Humedad de la planta ${plantName3}: ${data.moisture} %\n` +
        `Luz: ${((500 / data.lux).toFixed(2))*1000 } lux\n` +
        `pH: ${pH}\n` +
        `Fecha: ${formattedDate} \n` +
        `Hora: ${currentHourString}`;


      await saveMessage3("Sensors", ultimosDatosSensores);

      if (ultimosDatosSensores) {
        const mensajeAI = `Los datos de los sensores: 
        ${JSON.stringify(ultimosDatosSensores)}`;


        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey3}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: mensajeAI}],
            max_tokens: 150,
          }),
        });


        if (!response.ok) {
          console.error("Error al solicitar respuesta de la IA:"
              , response.status);
          return;
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error);
  }
};


exports.scheduleCheck = functions.pubsub
    .schedule("every 1 minutes")
    .onRun(async (context) => {
      await checkAndSetIrrigationState();
      await checkAndSetLightState();
      await checkAndSetLightState2();
      await checkAndSetLightState3();
      await checkSensorLimits();
      await checkSensorLimits2();
      await checkSensorLimits3();
    });

exports.scheduleCheck30Minutes = functions.pubsub
    .schedule("every 30 minutes")
    .onRun(async (context) => {
      await getSensorData();
      await getSensorData2();
      await getSensorData3();
    });
