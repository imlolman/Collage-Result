function setup() {
  var fb = firebase.initializeApp(keys);
  db = fb.firestore()
  storage = fb.storage();

  if (window.location.href.lastIndexOf('?go=') != -1) {
    loadStudent(window.location.href.substr(window.location.href.lastIndexOf('?go=') + 4))
  }
}

function loadStudent(slug) {
  $('.hintbox').empty();
  $('.searchbar').val('');
  $('#student-data').empty();
  $('#student-data').html('<h1 class="centerLoading"> <img src="images/loading.gif"> Please Wait While We Load Data... <img src="images/loading.gif"> </h1>');
  window.history.pushState("", "", '?go=' + slug);
  var studentsref = db.collection("students");
  studentsref.where("slug", "==", slug).limit(1).get().then(doc => doc.forEach(element => {
    displayData(element.data())
  }));
}

function displayData(data) {

  $('#student-data').empty();
  const {
    name,
    rollno,
    enroll,
    gender,
    category,
    mname,
    fname
  } = data;
  var detailsTemplate = `<div class="contentbg container">
  <div class="cardbox profile">
    <table class="data-table">
      <tr>
        <td>
          <span class="property">Name</span> <span class="value"> ${name} </span>
        </td>
        <td>
          <span class="property">Roll No.</span> <span class="value"> ${rollno} </span>
        </td>
        <td rowspan="4" class="phototd">
          <div id='${enroll}' src='#' class="studPhoto" alt="${name}"></div>
        </td>
      </tr>
      <tr>
        <td>
          <span class="property">Gender</span> <span class="value"> ${gender} </span>
        </td>
        <td>
          <span class="property">Category</span> <span class="value"> ${category} </span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="property">Father's Name</span> <span class="value"> ${fname} </span>
        </td>
        <td>
          <span class="property">Mother's Name</span> <span class="value"> ${mname} </span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="property">Enrollment No.</span> <span class="value"> ${enroll} </span>
        </td>
        <td>
          <span class="property">Persuing.</span> <span class="value">BCA</span>
        </td>
      </tr>
    </table>
  </div>`

  document.querySelector('#student-data').innerHTML = detailsTemplate;

  var storageRef = storage.ref();
  storageRef.child(data.enroll + '.jpg').getDownloadURL().then(url => displayImage(url, data.enroll))

  displayResultsTable(data.sem1);
  displayResultsTable(data.sem2)
  displayResultsTable(data.sem3)
  displayResultsTable(data.sem4)
  displayResultsTable(data.sem5)
  displayResultsTable(data.sem6)

  displayFinalTable(data.final)

}

function displayFinalTable(data) {
  if (data == null || undefined) {
    return
  }
  const {
    MaximumPossibleMarks,
    TotalMarksObtained,
    Percentage
  } = data;

  var middleTemplate = '';
  for (i = 1; i <= 12; i++) {
    rname = 'Result' + i + 'Name';
    rmax = 'Result' + i + 'Max';
    robt = 'Result' + i + 'Obtain';
    res = 'Result' + i;
    rattempt = 'Result' + i + 'Attempt';

    if (data[rname] == undefined) {
      break
    }

    middleTemplate += `<tr>
      <td>${data[rname]}</td><td>${data[rmax]}</td><td>${data[robt]}</td><td>${data[res]}</td><td>${data[rattempt]}</td>
    </tr>`
  }

  tableTemplate = `
  <h3 class="examHeading">All Total</h3>
    <div class="cardbox marks sem">
      <table class="marksTable">
        <tr class="heading">
          <th>Semester</th><th>Maximum Marks</th><th>Marks Obtain</th><th>Result</th><th>Attempt</th>
        </tr>
      ` + middleTemplate + ` <tr class="topline">
          <td>Total</td><td>${MaximumPossibleMarks}</td><td>${TotalMarksObtained}</td><td></td><td>Percentage ${Percentage}%</td>
        </tr>
      </table>
    </div>`

  $('.contentbg').append(tableTemplate)


}

function displayResultsTable(data) {
  if (data == null || undefined) {
    return
  }
  const {
    ExamName,
    Result,
    Attempt,
    TotalMarksObtained,
    MaximumPossibleMarks
  } = data;

  var middleTemplate = '';
  for (i = 1; i <= 12; i++) {
    pname = 'Paper' + i + 'Name';
    ptotal = 'Paper' + i + 'Max';
    ptype = 'Paper' + i + 'Type';
    pot = 'Paper' + i + 'Obtain';

    if (data[pname] == undefined) {
      break
    }

    middleTemplate += `<tr>
      <td>${data[pname]}</td><td>${data[ptotal]}</td><td>${data[ptype]}</td><td>${data[pot]}</td>
    </tr>`
  }

  tableTemplate = `
  <h3 class="examHeading">${ExamName}</h3>
  <div class="cardbox marks sem">
     <table class="marksTable">
       <tr class="heading">
         <th>Subject Name</th><th>Maximum Marks</th><th>Paper Type (T/P)</th><th>Marks Obtain</th>
       </tr>
  ` + middleTemplate + `<tr class="topline">
  <td>Total</td><td>${Result}</td><td>${Attempt} Attempts</td><td>${TotalMarksObtained}/${MaximumPossibleMarks}</td>
</tr>
</table>
</div>`

  $('.contentbg').append(tableTemplate)

}

function displayImage(src, id) {
  document.getElementById(id).style.background = 'url(' + src + ')';
  document.getElementById(id).style.backgroundSize = 'contain'
}

const allstudents = JSON.parse(
  `[{"name":"AAKASH BHADORIYA","url":"\/aakash-bhadoriya-60460743"},{"name":"AASHUTOSH DAVE","url":"\/aashutosh-dave-60460771"},{"name":"AAYUSH PANDEY","url":"\/aayush-pandey-60460762"},{"name":"ABDUL FARHAN","url":"\/abdul-farhan-60460740"},{"name":"ABHISHEK DOHRE","url":"\/abhishek-dohre-60460696"},{"name":"ABRAR KHAN","url":"\/abrar-khan-60460710"},{"name":"ACHAL SINGH YADAV","url":"\/achal-singh-yadav-60460728"},{"name":"AKANKSHA DUBEY","url":"\/akanksha-dubey-60460772"},{"name":"AMAN RAJ SINGH","url":"\/aman-raj-singh-60460715"},{"name":"ANANT SHUKLA","url":"\/anant-shukla-60460719"},{"name":"ANIL PATIDAR","url":"\/anil-patidar-60460714"},{"name":"ANJALI SONI","url":"\/anjali-soni-60460759"},{"name":"ANKUR KUMAR CHOUDHARY","url":"\/ankur-kumar-choudhary-60460756"},{"name":"ANSHAL MAHESHWARI","url":"\/anshal-maheshwari-60460748"},{"name":"APOORV KHARE","url":"\/apoorv-khare-60460779"},{"name":"CHARU MATI BODH","url":"\/charu-mati-bodh-60460769"},{"name":"DANISH QURESHI","url":"\/danish-qureshi-60460732"},{"name":"DEEPAK SHARMA","url":"\/deepak-sharma-60460725"},{"name":"DINESH SHARMA","url":"\/dinesh-sharma-60460717"},{"name":"DINESH KHATRI","url":"\/dinesh-khatri-60460706"},{"name":"HARSH RAJAK","url":"\/harsh-rajak-60460766"},{"name":"HARSHIT KUMAR SHARMA","url":"\/harshit-kumar-sharma-60460778"},{"name":"HIMANSHU TIWARI","url":"\/himanshu-tiwari-60460752"},{"name":"HRITIK POSWAL","url":"\/hritik-poswal-60460721"},{"name":"HUNAID L HANFEE","url":"\/hunaid-l-hanfee-60460707"},{"name":"KRISHNA YADAV","url":"\/krishna-yadav-60460687"},{"name":"KUNAL MAHAJAN","url":"\/kunal-mahajan-60460761"},{"name":"MADHUR JAISWAL","url":"\/madhur-jaiswal-60460700"},{"name":"MADHURI VERMA","url":"\/madhuri-verma-60460746"},{"name":"MAMLESH MALVIYA","url":"\/mamlesh-malviya-60460738"},{"name":"MANDAR DAMLE","url":"\/mandar-damle-60460781"},{"name":"MANDEEP SINGH JHALA","url":"\/mandeep-singh-jhala-60460734"},{"name":"MANISH DHOTE","url":"\/manish-dhote-60460689"},{"name":"MANISH YADAV","url":"\/manish-yadav-60460739"},{"name":"MAYANK SONI","url":"\/mayank-soni-60460737"},{"name":"MIHIR WARUNE","url":"\/mihir-warune-60460750"},{"name":"MOHIT PANDEY","url":"\/mohit-pandey-60460701"},{"name":"MOSHIN DIWAN","url":"\/moshin-diwan-60460703"},{"name":"NAMAN GHAREWAL","url":"\/naman-gharewal-60461053"},{"name":"NAMRATA MAKODE","url":"\/namrata-makode-60460723"},{"name":"NEHA VERMA","url":"\/neha-verma-60460745"},{"name":"NIKHIL PARIYANI","url":"\/nikhil-pariyani-60460775"},{"name":"NITESH CHOUDHARY","url":"\/nitesh-choudhary-60460744"},{"name":"NITESH SHUKLA","url":"\/nitesh-shukla-60460694"},{"name":"NUPOOR VYAS","url":"\/nupoor-vyas-60460757"},{"name":"OM BHARGAVA BHARGAVA","url":"\/om-bhargava-bhargava-60460722"},{"name":"PALAK MODI","url":"\/palak-modi-60460708"},{"name":"PANKAJ CHAWDA","url":"\/pankaj-chawda-60460702"},{"name":"PRACHI BHAND","url":"\/prachi-bhand-60460724"},{"name":"RAHUL JOSHI","url":"\/rahul-joshi-60460713"},{"name":"RAHUL RAGHUWANSHI","url":"\/rahul-raghuwanshi-60460755"},{"name":"RAJENDRA PATIDAR","url":"\/rajendra-patidar-60460691"},{"name":"RAJNANDNI SHARMA","url":"\/rajnandni-sharma-60460764"},{"name":"RANVEER ANJANA","url":"\/ranveer-anjana-60460742"},{"name":"RAVI GUPTA","url":"\/ravi-gupta-60460741"},{"name":"RIDESH","url":"\/ridesh-60460704"},{"name":"RISHABH DAPKARA","url":"\/rishabh-dapkara-60460699"},{"name":"RISHI DEV YADAV","url":"\/rishi-dev-yadav-60460727"},{"name":"RITESH SHER","url":"\/ritesh-sher-60460688"},{"name":"RITESH DANGI","url":"\/ritesh-dangi-60460760"},{"name":"ROHIT CHOUDHARY","url":"\/rohit-choudhary-60460749"},{"name":"ROHIT KUMRAWAT","url":"\/rohit-kumrawat-60460695"},{"name":"RUPAL MODI","url":"\/rupal-modi-60460692"},{"name":"RUSHALI JAIN","url":"\/rushali-jain-60460753"},{"name":"SAJAL SAXENA","url":"\/sajal-saxena-60460705"},{"name":"SAKSHI SINGH","url":"\/sakshi-singh-60460690"},{"name":"SAKSHI NANDWAL","url":"\/sakshi-nandwal-60460697"},{"name":"SAMARTH SUNIL RAGHUWANSHI","url":"\/samarth-sunil-raghuwanshi-60460718"},{"name":"SANGRAM S THAKUR","url":"\/sangram-s-thakur-60460770"},{"name":"SATYAM GUPTA","url":"\/satyam-gupta-60460698"},{"name":"SHAILY PAWAR","url":"\/shaily-pawar-60460711"},{"name":"SHEFALI","url":"\/shefali-60460730"},{"name":"SHIVAM SINGOUR","url":"\/shivam-singour-60460758"},{"name":"SHIVANSHU VARMA","url":"\/shivanshu-varma-60460768"},{"name":"SHIVSHANKAR PATEL","url":"\/shivshankar-patel-60460726"},{"name":"SHUBHAM PATIL","url":"\/shubham-patil-60460733"},{"name":"SHUBHAM YADUVANSHI","url":"\/shubham-yaduvanshi-60460735"},{"name":"SHUBHAM KUSHWAH","url":"\/shubham-kushwah-60460776"},{"name":"SHUBHAM NIRANJAN SAROJ","url":"\/shubham-niranjan-saroj-60460754"},{"name":"SHWETA YADAV","url":"\/shweta-yadav-60460774"},{"name":"SUBHASH AGRAWAL","url":"\/subhash-agrawal-60460767"},{"name":"TEJ KUMAR","url":"\/tej-kumar-60460731"},{"name":"TEJANSHU KUMAR","url":"\/tejanshu-kumar-60460716"},{"name":"VIMAL PATIDAR","url":"\/vimal-patidar-60460720"},{"name":"VIPIN TIWARI","url":"\/vipin-tiwari-60460773"},{"name":"VIPIN RAJORIYA","url":"\/vipin-rajoriya-60460729"},{"name":"VIRENDRA SISODIYA","url":"\/virendra-sisodiya-60460712"},{"name":"VISHAL YADAV","url":"\/vishal-yadav-60460765"},{"name":"YASH KALRA","url":"\/yash-kalra-60460747"},{"name":"YASH BAKSHI","url":"\/yash-bakshi-60460780"},{"name":"YASH DODWA","url":"\/yash-dodwa-60460693"},{"name":"YESH SONI","url":"\/yesh-soni-60460751"}]`
)

function search(e) {
  var toplace = []
  allstudents.forEach(student => {
    if (student.name.toLowerCase().search(e.toLowerCase()) != -1) {
      toplace.push(firstUpper(student))
    }
  });
  place(toplace)
}

function place(toplace) {
  console.log(toplace)
  var finalHtml = ""
  Array.prototype.forEach.call(toplace, item => {
    finalHtml += `<div class="hint"><span onclick="loadStudent('` + item.url.substring(1) + `')">` + item.name + `</span></div>`
  });
  document.getElementById('hintbox').innerHTML = finalHtml;
}

function firstUpper(student) {
  student.name = student.name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
  return student;
}