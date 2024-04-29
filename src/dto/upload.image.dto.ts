import { MemoryStoredFile } from 'nestjs-form-data';

export class UploadImageDTO {
  from: string;
  id: string;
  file: MemoryStoredFile;
  currentPath: string = null;
}
