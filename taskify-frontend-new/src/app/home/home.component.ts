import { Component , OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  user=''
  userid:string=''
  useridNum:Number=0
  currentUserDetails:any=[];
  currentTasks:any=[];
  logoutStatus:boolean=false;
  taskDiv: boolean = false;
  moreDiv:boolean = false;
  searchTerm:String=''

  proidNum:Number=0;
  projectDiv: boolean = false;
  moreProjectDiv:boolean = false;


  // task variables
  taskname:string = '';
  taskdesc:string = '';
  prestatus:string = 'pending';
  status:string = '';
  proid:Number = 0;
  proname:string = '';
  days:Number = 0;
  hours:Number = 0;
  minutes:Number = 0;

  // to store fetched 
  numberOfDays: number = 0;
  numberOfHours: number = 0;
  numberOfMinutes: number = 0;
  countdown: string='';


//   taskData = { 
//     proid:0,
//     proname:'',
//     taskname:'',
//     status:0,
//     taskdesc:'',
//     days:Number,
//     hours:Number,
//     mins:Number,
//     countdown :this.countdown
//  };


  constructor(private fundfb:FormBuilder,private api:ApiService, private loginRouter:Router, http:HttpClientModule, private dashboardRouter:Router){}


  ngOnInit(): void {
    if(!localStorage.getItem('token')){   
      alert('Please Login')
      this.dashboardRouter.navigateByUrl('')
      
    }
    if(localStorage.getItem('currentUser')){
      this.user=localStorage.getItem('currentUser')||''
      console.log(this.user)
    }
    if(localStorage.getItem('currentAcno')){
      this.userid=localStorage.getItem('currentAcno')||''
      this.useridNum = +this.userid
    }
    //getting current user details
    this.api.getUser(this.useridNum).subscribe((result:any)=>{
      console.log(result.currentUser)
      this.currentUserDetails = result.currentUser;
      this.currentTasks = this.currentUserDetails.projects;
      console.log(this.currentTasks)
      // this.userName = result.currentUser.username;
      // console.log(this.userName)

    },
    (result:any)=>{
      console.log(this.useridNum); 

      console.log(result.error.message);
    }
    )

  } // ngon end


  search(event:any){
    this.searchTerm=event.target.value;
    console.log(this.searchTerm)

  }


  toggleTaskDiv() {
    this.taskDiv = !this.taskDiv;
  }
  toggleMoreDetails(){
    this.moreDiv = !this.moreDiv;
  }

  toggleProjectDiv() {
    this.projectDiv = !this.projectDiv;
  }
  toggleMoreProDetails(){
    this.moreProjectDiv = !this.moreProjectDiv;
  }

 //logout fn
 logout(){
  this.logoutStatus=true;
  localStorage.clear();
    setTimeout(()=>{
       this.dashboardRouter.navigateByUrl('');
      },500)
  }
  
   //add project
   addProject(){
    this.proidNum = +this.proid;
    console.log(this.proidNum)
    this.api.addProject(this.useridNum,this.proidNum,this.proname)
    .subscribe(response => {
      // console.log(this.useridNum)
      console.log('Response from the backend:', response);
      
    });
    alert(`Project Created Successfully `)
}

    // add task
    addTaskToBackend() {
      this.api.addTask(this.useridNum, this.proid, this.proname, this.taskname, this.prestatus, this.taskdesc, this.days, this.hours, this.minutes)
      
        .subscribe(response => {
          // console.log(this.useridNum)
          console.log('Response from the backend:', response);
          
        });
        alert(`Task Created for ${this.proname}`)
        alert(`--You have ${this.days}days and ${this.hours}hours to complete the task --`)
    }



  
    // countdown function
  updateCountdown(): void {
    if (
      this.numberOfDays >= 0 ||
      this.numberOfHours >= 0 ||
      this.numberOfMinutes >= 0
    ) {
      let totalMinutes =
        this.numberOfDays * 24 * 60 +
        this.numberOfHours * 60 +
        this.numberOfMinutes;

      const interval = setInterval(() => {
        if (totalMinutes <= 0) {
          clearInterval(interval);
          this.countdown = 'Time is up!';
        } else {
          const days = Math.floor(totalMinutes / 60 / 24);
          const hours = Math.floor((totalMinutes / 60) % 24);
          const minutes = totalMinutes % 60;
          this.countdown = `${days}d ${hours}h ${minutes}m`;
          totalMinutes--;

          // Check for specific countdown intervals
          if (totalMinutes === 30) {
            alert('30 minutes remaining');
          } else if (totalMinutes === 10) {
            alert('10 minutes remaining');
          } else if (totalMinutes === 1) {
            alert('1 minute remaining');
          }
        }
      }, 60000); // Update every minute
    }
  }




}
