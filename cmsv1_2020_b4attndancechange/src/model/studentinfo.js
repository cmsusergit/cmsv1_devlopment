import GuardianInfo from './guardianinfo.js';
export default class StudentInfo{
  constructor(){
    this.stuId=0;
    this.stuCollegeId='';
    this.stuEnroll='';
    this.stuTitle='Mr.';
    this.stuFirstname='';
    this.stuMiddlename='';
    this.stuLastname='';
    this.stuGender='Male'
    this.stuDob= new Date('2001-01-01');
    this.stuEmail='';
    this.stuBloodgroup='A+';
    this.stuReligion='Hindu';
    this.stuMobile='';
    this.stuNationality='Indian';
    this.stuCategory='Open';
    //this.stuPhoto='';
    //
    this.studentFatherFname="",
    this.studentFatherMname="";
    this.studentFatherLname="";
    this.studentFatherOccupation="";
    this.studentFatherContact="";
    this.studentFatherAnnualIncome=0;
    this.studentMotherFname="";
    this.studentMotherMname="";
    this.studentMotherLname="";










    this.fDeptId=0;
    this.fBatchId=0;
    this.fCourseId=0;
    this.fClassId=0;
    this.fcurrsem="1";
    this.stuAdmissiondate=new Date();
    this.stuCurrAddress="";
    this.stuCurrCity="";
    this.stuCurrCountry= "";
    this.stuCurrPincode= "";
    this.stuCurrState= "";
    this.stuPerAddress= "";
    this.stuPerCity= "";

    this.stuPerCountry= "INDIA";
    this.stuPerPincode= "";
    this.stuPerState= "";
    this.stuStatus="1";
  }

  pad2=function(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};
  formatDtFor = function(dt) {
    var dtstring = dt.getFullYear()
      + '-' + this.pad2(dt.getMonth()+1)
      + '-' + this.pad2(dt.getDate())
      + ' ' + this.pad2(dt.getHours())
      + ':' + this.pad2(dt.getMinutes())
      + ':' + this.pad2(dt.getSeconds());
    return dtstring;
};
}
/*{
  "stuCollegeId":"10",
  "stuEnroll":"01",
  "stuTitle":"Mr.",
  "stuFirstname":"test1",
  "stuMiddlename":"tt",
  "stuLastname":"test1",
  "stuGender":"Male",
  "stuDob":"2000-12-31T18:30:00.000Z",
  "stuEmail":"tt@tt.co",
  "stuBloodgroup":"-",
  "stuReligion":"Hindu",
  "stuMobile":"10101010",
  "stuNationality":"Indian",
  "stuCategory":"Open",
  "studentFatherFname":"ff",
  "studentFatherMname":"ff",
  "studentFatherLname":"ll",
  "studentFatherOccupation":"",
  "studentFatherContact":"10101010",
  "studentFatherAnnualIncome":"10",
  "studentMotherFname":"ff",
  "studentMotherMname":"ff",
  "studentMotherLname":"ll",
  "fDeptName":"CE",
  "fBatchName":"A",
  "fCourseName":"BE",
  "fClassName":"I",
  "stuAdmissiondate":"2018-10-29T06:47:58.054Z"
}
*/
