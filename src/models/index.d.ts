import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerBookmark = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Bookmark, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url: string;
  readonly timestamp: number;
  readonly title?: string | null;
  readonly thumbnail?: string | null;
  readonly note?: string | null;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBookmark = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Bookmark, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url: string;
  readonly timestamp: number;
  readonly title?: string | null;
  readonly thumbnail?: string | null;
  readonly note?: string | null;
  readonly userID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Bookmark = LazyLoading extends LazyLoadingDisabled ? EagerBookmark : LazyBookmark

export declare const Bookmark: (new (init: ModelInit<Bookmark>) => Bookmark) & {
  copyOf(source: Bookmark, mutator: (draft: MutableModel<Bookmark>) => MutableModel<Bookmark> | void): Bookmark;
}