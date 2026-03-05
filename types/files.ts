export enum FileCategory {
  GALLERY = "GALLERY",
  DOCUMENT = "DOCUMENT",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
  PROFILE = "PROFILE",
  ASSIGNMENT = "ASSIGNMENT",
  SUBMISSION = "SUBMISSION",
  PAST_PAPER = "PAST_PAPER",
  JOURNAL = "JOURNAL",
  NEWSPAPER = "NEWSPAPER",
  AVATAR = "AVATAR",
}

export enum MediaType {
  IMAGE_JPEG = "image/jpeg",
  IMAGE_PNG = "image/png",
  IMAGE_GIF = "image/gif",
  IMAGE_WEBP = "image/webp",
  APPLICATION_PDF = "application/pdf",
  APPLICATION_MSWORD = "application/msword",
  APPLICATION_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  VIDEO_MP4 = "video/mp4",
  AUDIO_MPEG = "audio/mpeg",
}

export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  key: string;
  metadata?: Record<string, any>;
  createdAt?: string;
}
