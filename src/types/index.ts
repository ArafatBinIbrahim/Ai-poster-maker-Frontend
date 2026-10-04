//project data model অনুযায়ী সমস্ত টাইপ এবং interface এখানে define করা হয়েছে।   

export interface IUser {
  _id: string;
  name: string;
  emailOrPhone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ITemplate {
  _id: string;
  title: string;
  occasionType: 'বিজয় দিবস' | 'শোক/স্মরণ' | 'নির্বাচনী প্রচার' | 'শুভেচ্ছা' | 'ঈদ/উৎসব';
  thumbnailUrl: string;
  layoutConfig: {
    photoSlots: number;
    textSlots: string[];
    colorScheme: string;
  };
  isActive: boolean;
}

export interface IPoster {
  _id: string;
  userId: string;
  templateId: string;
  formData: {
    name: string;
    designation: string;
    party: string;
    district: string;
    occasionType: string;
    headlineText: string;
  };
  uploadedPhotoUrls: string[];
  generatedImageUrl?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  createdAt: string;
}