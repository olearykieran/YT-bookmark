import { Model, field } from 'aws-amplify';

@Model()
export class Bookmark {
  @field({ type: 'ID', isRequired: true }) id;
  @field({ type: 'String', isRequired: true }) url;
  @field({ type: 'Float', isRequired: true }) timestamp;
  @field({ type: 'String' }) title;
  @field({ type: 'String' }) note;
  @field({ type: 'String' }) thumbnail;
  @field({ type: 'AWSDateTime' }) createdAt;
  @field({ type: 'AWSDateTime' }) updatedAt;
} 