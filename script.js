// Dict: {name: no_of_duties}
let nameList = {};
// Dict: {name: [block_out_date, ...]}
let nameBlock = {};
let excludeNames = [];
let totalDuties = 0;
// Month and year of level duty
let month = 0;
let year = 0;
// Array of Date objects
let hols = [];
// date.getDay(): holiday name
let holNames = {};

let numDaysInMonth = 31;

function localStorageInit() {
  // check if localStorage is supported and has been set
  if (typeof Storage !== "undefined") {
    if (localStorage.getItem("setSave") === null) {
      localStorage.setItem("setSave", true);
    }
  } else {
    document.getElementById("setSave").style.display = "none";
  }

  // load localStorage
  if (localStorage.getItem("nameList")) {
    document.getElementById("nameList").value =
      localStorage.getItem("nameList");
    autoResize("nameList");
    updateNameList();
  }
  if (localStorage.getItem("nameBlock")) {
    document.getElementById("nameBlock").value =
      localStorage.getItem("nameBlock");
    autoResize("nameBlock");
    updateNameBlock();
  }
  if (localStorage.getItem("excludeNames")) {
    document.getElementById("excludeNames").value =
      localStorage.getItem("excludeNames");
    autoResize("excludeNames");
    updateExcludeNames();
  }
  if (localStorage.getItem("randomSeed")) {
    document.getElementById("randomSeed").value =
      localStorage.getItem("randomSeed");
    autoResize("randomSeed");
  }
  if (localStorage.getItem("ignoreFirstThreeLines")) {
    document.getElementById("ignoreFirstThreeLines").checked =
      localStorage.getItem("ignoreFirstThreeLines");
  }
}

function updateSave() {
  if (document.getElementById("setSave").checked) {
    localStorage.setItem("nameList", document.getElementById("nameList").value);
    localStorage.setItem(
      "nameBlock",
      document.getElementById("nameBlock").value
    );
    localStorage.setItem(
      "excludeNames",
      document.getElementById("excludeNames").value
    );
    localStorage.setItem(
      "randomSeed",
      document.getElementById("randomSeed").value
    );
    localStorage.setItem(
      "ignoreFirstThreeLines",
      document.getElementById("ignoreFirstThreeLines").checked
    );
  } else {
    localStorage.removeItem("nameList");
    localStorage.removeItem("nameBlock");
    localStorage.removeItem("excludeNames");
    localStorage.removeItem("randomSeed");
    localStorage.removeItem("ignoreFirstThreeLines");
  }
}

// Function to resize the textarea's height automatically, if empty, resize to fit placeholder
function autoResize(id) {
  const textarea = document.getElementById(id);
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

// Function to ignore first 3 lines of nameBlock
function ignoreFirstThreeLines() {
  let nameBlock = document.getElementById("nameBlock");
  let checked = document.getElementById("ignoreFirstThreeLines").checked;
  if (checked) {
    nameBlock.placeholder =
      "Follow the format below:\nName/Block out dates\nEg. Lester/01-05-2023\n\nIan/03-01-2024, 16-01-2024 - 18-01-2024\n\nNeville/03-01-2024\n\nDanyel/5-01-2024, 8-01-2024, 12-01-2024";
    if (nameBlock.value === "") {
      nameBlock.style.height = "15rem";
    }
  } else {
    nameBlock.placeholder =
      "Ian/03-01-2024, 16-01-2024 - 18-01-2024\n\nNeville/03-01-2024\n\nDanyel/5-01-2024, 8-01-2024, 12-01-2024";
    if (nameBlock.value === "") {
      nameBlock.style.height = "9rem";
    }
  }
  updateNameBlock();
}

function checkNameRepeat(name) {
  nameListError = document.getElementById("nameListError");
  if (Object.keys(nameList).includes(name)) {
    // display error message, return
    nameListError.style.display = "block";
    nameListError.innerHTML = `${
      name.charAt(0).toUpperCase() + name.slice(1)
    } in name list > 1`;
    return true;
  }
}

function formatDate(line, rawDates, nameBlockError) {
  // split comma, trim and filter
  let dates = rawDates
    .split(",")
    .map((date) => date.trim())
    .filter((element) => element);

  // check if no dates
  if (dates.length === 0) {
    // display error message, return
    nameBlockError.style.display = "block";
    nameBlockError.innerHTML = `No dates in ${line}`;
    return;
  }

  let finalDates = [];

  for (let date of dates) {
    // check if date is a range
    // split dash, trim and filter
    let dateRange = date
      .split("-")
      .map((date) => date.trim())
      .filter((element) => element);

    // check if length 3 or 6
    // dd-mm-yyyy or dd-mm-yyyy - dd-mm-yyyy
    if (dateRange.length === 3 || dateRange.length === 6) {
      // check if all are numbers
      if (
        !dateRange.every((date) => !isNaN(parseFloat(date)) && isFinite(date))
      ) {
        // display error message, return
        nameBlockError.style.display = "block";
        nameBlockError.innerHTML = `Invalid date ${date} in ${line}`;
        return;
      } else {
        // set to integer
        dateRange = dateRange.map((date) => parseInt(date));
      }
    } else {
      // display error message, return
      nameBlockError.style.display = "block";
      nameBlockError.innerHTML = `Invalid date ${date} in ${line}`;
      return;
    }

    // do checks for both dates if length 6 (range)
    for (let i = 0; i < dateRange.length; i += 3) {
      // check if dateRange[1] (month) is between 1 and 12
      if (dateRange[1 + i] < 1 || dateRange[1 + i] > 12) {
        // display error message, return
        nameBlockError.style.display = "block";
        nameBlockError.innerHTML = `Invalid month ${
          dateRange[1 + i]
        } in ${line}`;
        return;
      }

      // set month if month = 0, else check if month is the same
      if (month === 0) {
        month = dateRange[1 + i];
        updateMonthYear();
      } else if (month !== dateRange[1 + i]) {
        // display error message, return
        nameBlockError.style.display = "block";
        nameBlockError.innerHTML = `Month of ${date} in ${line} is not the same as the other dates`;
        return;
      }

      // check if dateRange[2] (year) is this year or next year
      let thisYear = new Date().getFullYear();
      if (dateRange[2 + i] !== thisYear && dateRange[2 + i] !== thisYear + 1) {
        // display error message, return
        nameBlockError.style.display = "block";
        nameBlockError.innerHTML = `Invalid year ${
          dateRange[2 + i]
        } in ${line}`;
        return;
      }

      // set year if year = 0, else check if year is the same
      if (year === 0) {
        year = dateRange[2 + i];
        updateMonthYear();
      } else if (year !== dateRange[2 + i]) {
        // display error message, return
        nameBlockError.style.display = "block";
        nameBlockError.innerHTML = `Year of ${date} in ${line} is not the same as the other dates`;
        return;
      }

      // check if dateRange[0] (day) is between days of this month and year
      if (
        dateRange[0 + i] < 1 ||
        dateRange[0 + i] >
          new Date(dateRange[2 + i], dateRange[1 + i], 0).getDate()
      ) {
        // display error message, return
        nameBlockError.style.display = "block";
        nameBlockError.innerHTML = `Invalid day ${dateRange[0 + i]} in ${line}`;
        return;
      }
    }

    // save date's day
    finalDates.push(dateRange[0]);

    // if length 6, add all days in range
    if (dateRange.length === 6) {
      for (let i = dateRange[0] + 1; i <= dateRange[3]; i++) {
        finalDates.push(i);
      }
    }

    // close error message
    nameBlockError.style.display = "none";
  }

  return finalDates;
}

// Function to update nameList
function updateNameList() {
  let rawNameList = document.getElementById("nameList").value;

  // empty nameList
  nameList = {};

  // split newline, trim, filter empty lines
  let lines = rawNameList
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  for (let line of lines) {
    // split space and remove empty strings
    lineArr = line.split(" ").filter((element) => element);

    // check if last index is number
    if (!isNaN(parseFloat(lineArr.at(-1))) && isFinite(lineArr.at(-1))) {
      // ends with a number, which is no. of extra duties
      let duties = parseInt(lineArr.at(-1));

      // check its not -1 extra duties which is no duties
      if (duties !== -1) {
        // convert to lower case, remove spaces
        let name = lineArr.slice(0, -1).join("").toLowerCase();

        // check if name in name list
        if (checkNameRepeat(name)) {
          return;
        }

        // initialise with 1 base duty
        nameList[name] = duties + 1;
      }
    } else {
      // no extra duties
      // convert to lower case, remove spaces
      let name = line.toLowerCase().replace(/\s/g, "");

      // check if name in name list
      if (checkNameRepeat(name)) {
        return;
      }

      // initialise with 1 duty
      nameList[name] = 1;
    }
  }

  // close error message
  nameListError.style.display = "none";

  // Update nameListInfo
  nameListInfo = document.getElementById("nameListInfo");

  // if there's at least 1 name in the name list
  if (Object.keys(nameList).length > 0) {
    totalDuties = Object.values(nameList).reduce((additional, total) => {
      return additional + total;
    }, 0);
    // Display no. of names and total duties
    nameListInfo.style.display = "block";
    nameListInfo.innerHTML = `No. of names: ${Object.keys(nameList).length}
          ${
            totalDuties > numDaysInMonth
              ? `<br /><span class="text-red-500">Total duties: ${totalDuties} > ${numDaysInMonth} days in month</span>`
              : `&emsp; Total duties: ${totalDuties}`
          }`; // > x days of duty
  } else {
    nameListInfo.style.display = "none";
  }

  // console.log(nameList);
}

// Function to update nameBlock
function updateNameBlock() {
  let rawNameBlock = document.getElementById("nameBlock").value;

  // to display error messages
  let nameBlockError = document.getElementById("nameBlockError");

  // empty nameBlock
  nameBlock = {};

  // split newline, trim, filter empty lines
  let lines = rawNameBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // ignore lines if ignoreFirstThreeLines is checked
  if (document.getElementById("ignoreFirstThreeLines").checked) {
    lines = lines.slice(3);
  }

  for (let line of lines) {
    // split slash, trim and filter
    let splitLine = line
      .split("/")
      .map((line) => line.trim())
      .filter((element) => element);

    // check if not 1 slash in line
    if (splitLine.length != 2) {
      // display error message, return
      nameBlockError.style.display = "block";
      nameBlockError.innerHTML = `${
        splitLine.length < 2 ? "No <i>/date</i>" : "Too many slashes"
      } in ${line}`;
      return;
    }

    let [name, rawDates] = splitLine;

    // convert name to lower case, remove all spaces
    name = name.toLowerCase().replace(/\s/g, "");

    // check if name in name list
    if (!Object.keys(nameList).includes(name)) {
      // display error message, return
      nameBlockError.style.display = "block";
      nameBlockError.innerHTML = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } not in name list`;
      return;
    }

    // format raw date string
    let dates = formatDate(line, rawDates, nameBlockError);
    if (!dates) {
      return;
    }

    // check if name in name block, raise error if so
    if (Object.keys(nameBlock).includes(name)) {
      // display error message, return
      nameBlockError.style.display = "block";
      nameBlockError.innerHTML = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } in name block > 1`;
      return;
    }

    // add to nameBlock
    nameBlock[name] = dates;
  }

  // add remaining names in nameList to nameBlock
  for (let name in nameList) {
    if (!Object.keys(nameBlock).includes(name)) {
      nameBlock[name] = [];
    }
  }

  // close error message
  nameBlockError.style.display = "none";
  // console.log(nameBlock);
}

// Function to update exludeNames
function updateExcludeNames() {
  let rawExcludeNames = document.getElementById("excludeNames").value;
  let excludeNamesError = document.getElementById("excludeNamesError");

  // split newline, trim, filter empty lines
  let lines = rawExcludeNames
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  excludeNames = lines
    // convert to lower case, remove spaces
    .map((name) => name.toLowerCase().replace(/\s/g, ""))
    // if name not in name list raise error
    .filter((name) => {
      if (!Object.keys(nameList).includes(name)) {
        // display error message, return
        excludeNamesError.style.display = "block";
        excludeNamesError.innerHTML = `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } not in name list`;
        return false;
      }
      excludeNamesError.style.display = "none";
      return true;
    });

  // console.log(excludeNames);
}

// Function that updates hols with all days in the month that is a holiday in Singapore with date-holidays
function getHolidays() {
  // get all holidays in Singapore
  const hd = new window.Holidays.default("SG");
  const holidays = hd.getHolidays(year);

  // filter holidays to only include those in the month
  const holidaysInMonth = holidays.filter(
    (holiday) => new Date(holiday.date).getMonth() + 1 === month
  );

  // console.log(holidaysInMonth);
  // update hols
  hols = holidaysInMonth.map((holiday) => new Date(holiday.date));

  // update holNames
  holNames = holidaysInMonth.reduce((obj, holiday) => {
    obj[new Date(holiday.date).getDay()] = holiday.name;
    return obj;
  }, {});
}

// Proxy to log changes to month and year, update datepicker and hols, and update month and year in dateHeader
function updateMonthYear() {
  getHolidays();
  datepicker.changeMonth(month - 1, false);
  datepicker.changeYear(year, false);

  // add hols to datepicker selected dates
  datepicker.setDate(hols, true);

  // get number of days in month
  numDaysInMonth = new Date(year, month, 0).getDate();

  // exclude weekends
  for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
    let date = new Date(year, month - 1, i);
    if (date.getDay() === 0 || date.getDay() === 6) {
      numDaysInMonth--;
    }
  }
  numDaysInMonth -= hols.length;

  document.getElementById("randomSeed").value = `${year * 100 + month}`;
  dateHeader.innerHTML = `Days with no duty (holidays, etc.) - ${month}/${year}`;
}

const datepicker = flatpickr("#date-picker", {
  mode: "multiple",
  dateFormat: "d-m-Y",
  // disable weekends
  disable: [
    function (date) {
      // return true to disable
      return date.getDay() === 0 || date.getDay() === 6;
    },
  ],
  // on change, update hols and numDaysInMonth
  onChange: function (selectedDates, dateStr, instance) {
    hols = selectedDates;
    numDaysInMonth = new Date(year, month, 0).getDate();
    // exclude weekends
    for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
      let date = new Date(year, month - 1, i);
      if (date.getDay() === 0 || date.getDay() === 6) {
        numDaysInMonth--;
      }
    }
    numDaysInMonth -= hols.length;
  },
});

function getResult() {
  // check if there are any errors
  errorIds = ["nameListError", "nameBlockError", "excludeNamesError"];
  for (let id of errorIds) {
    if (document.getElementById(id).style.display === "block") {
      document.getElementById("resultError").style.display = "block";
      document.getElementById("resultError").innerHTML = "Errors above";
      return;
    }
  }
  document.getElementById("result").value = "Loading...";
  document.getElementById("result").style.display = "block";

  // extra duties to assign to fill up numDaysInMonth
  let extraDuties = numDaysInMonth - totalDuties;

  if (extraDuties < 0) {
    return;
  }

  let nameListCopy = Object.assign({}, nameList);

  // create random pool, filter out names in excludeNames, sort alphabetically
  let randomPool = Object.keys(nameList)
    .filter((name) => !excludeNames.includes(name))
    .sort();

  // seedrandom takes in a string
  // https://github.com/davidbau/seedrandom
  let rng = new Math.seedrandom(
    document.getElementById("randomSeed").value === ""
      ? null
      : document.getElementById("randomSeed").value
  );

  // shuffle randomPool with rng()
  // Durstenfeld shuffle : https://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
  for (let i = randomPool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [randomPool[i], randomPool[j]] = [randomPool[j], randomPool[i]];
  }

  // divide extraDuties by randomPool.length
  let baseDuties = Math.floor(extraDuties / randomPool.length);

  // add remainder to first few names in randomPool
  let remainder = extraDuties % randomPool.length;

  // add duties to nameList
  for (let i = 0; i < randomPool.length; i++) {
    nameListCopy[randomPool[i]] += baseDuties;
    if (i < remainder) {
      nameListCopy[randomPool[i]]++;
    }
  }

  // console.log(nameListCopy);

  let calendar = {};
  let totalDaysInMonth = new Date(year, month, 0).getDate();
  // create dict of duty days of the month with weekends and holidays excluded
  let dutyDays = {}; // change to array
  let holsDates = hols.map((date) => date.getDate());
  for (let i = 1; i <= totalDaysInMonth; i++) {
    let date = new Date(year, month - 1, i);
    if (date.getDay() === 0 || date.getDay() === 6 || holsDates.includes(i)) {
      dutyDays[i] = 0;
    } else {
      dutyDays[i] = 1;
    }
  }
  // console.log(holsDates);
  // console.log(dutyDays);
  // fill calendar with names, starting from 1st day of month, excluding weekends and holidays, and excluding the names' block out dates
  // calendar = {day: name}
  // use backtracking to fill calendar
  function fillCalendar(day) {
    // check if day is number of days in month + 1
    if (day > totalDaysInMonth) {
      return true;
    }

    if (dutyDays[day] === 0) {
      return fillCalendar(day + 1);
    }

    // check if day is in any name's block out dates
    let noSolution = true;
    for (let name in nameListCopy) {
      if (!nameBlock[name].includes(day)) {
        if (nameListCopy[name] > 0) {
          nameListCopy[name]--;
          calendar[day] = name;
          // console.log(dutyDays[day], day);
          if (fillCalendar(day + 1)) {
            noSolution = false;
            break;
          }
          // remove name from calendar
          delete calendar[day];
          nameListCopy[name]++;
        }
      }
    }

    return !noSolution;
  }

  // console.log(calendar);
  if (!fillCalendar(1)) {
    // display error message, return
    document.getElementById("resultError").style.display = "block";
    document.getElementById(
      "resultError"
    ).innerHTML = `No solution found with seed ${
      document.getElementById("randomSeed").value
    }`;
    document.getElementById("result").style.display = "none";
    return;
  }

  for (let holDay of holsDates) {
    calendar[holDay] = `- (${
      Object.keys(holNames).includes(holDay.toString())
        ? holNames[holDay].toUpperCase()
        : "NO DUTY"
    })`;
  }

  // console.log(calendar);

  // format calendar into string
  let result = `Hi all, I've sent out the ${month}/${year} duty roster. Please take note of your duties. Thanks!\n\n${month}/${year}:\n\n`;
  let lastDay = 0;
  for (let day in calendar) {
    // check if day is not consecutive
    if (parseInt(day) !== lastDay + 1) {
      result += "\n";
    }
    lastDay = parseInt(day);

    result += `${day} ${
      calendar[day].charAt(0).toUpperCase() + calendar[day].slice(1)
    }\n`;
  }
  // console.log(result);

  // display result
  document.getElementById("result").value = result;
  document.getElementById("result").style.display = "block";
  autoResize("result");
  document.getElementById("copyResult").style.display = "block";

  // close error message
  document.getElementById("resultError").style.display = "none";
}

function copyResult() {
  let copyText = document.getElementById("result");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

localStorageInit();
