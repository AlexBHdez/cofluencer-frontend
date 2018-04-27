import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CompanyService } from '../../services/company.service';
import { FileUploader } from 'ng2-file-upload';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {

  private API_URL = 'http://localhost:3000/api';

  uploader: FileUploader = new FileUploader({
    url: `${this.API_URL}/upload-image`,
  });
  feedback: string;

  // user: any;
  editingUser = {
    username: '',
    brandName: '',
    email: '',
    bio: '',
    city: '',
    profileImage: '',
  };
  options = {
    withCredentials: true,
  };

  constructor(
    private session: AuthService,
    private router: Router,
    private companyService: CompanyService,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.editingUser = this.session.getUser();
    console.log(this.editingUser);
    this.uploader.onAfterAddingFile = (item) => {
      this.uploadImage(item, this.options);
      this.toaster.success(`${this.editingUser.username}`, 'Image update! 📸 Update Profile to see the changes');
    };
  }

  updateUser() {
    console.log(this.editingUser);
    this.companyService.updateUser(this.editingUser)
      .then((updatedUser) => {
        this.session.setUser(updatedUser);
        this.router.navigate(['company', updatedUser.username]);
        this.toaster.success(`${this.editingUser.username}`, 'your profile is updated! 👍');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  uploadImage(item, options) {
      this.uploader.uploadAll();
  }

  close() {
    this.router.navigate(['company', this.editingUser.username]);
  }

}
