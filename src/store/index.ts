import { computed } from 'mobx';
import { AssetStore } from './AssetStore';
import { BaseStore } from './BaseStore';
import { GameDataStore } from './GameDataStore';
import { ImageStore } from './ImageStore';

export class Store {
  // tslint:disable:member-ordering
  private readonly _stores: BaseStore[] = [];

  public readonly assets = this.registerStore(AssetStore);
  public readonly gameData = this.registerStore(GameDataStore);
  public readonly images = this.registerStore(ImageStore);
  public readonly ui: Record<string, any> = {};

  // tslint:enable:member-ordering

  @computed
  public get isLoaded() { return this._stores.every(store => store.isLoaded); }

  public async load() {
    await Promise.all(this._stores.map(store => store.load()));
  }

  private registerStore<ChildStore extends BaseStore>(ChildStore: { new(root: Store): ChildStore }): ChildStore {
    const store = new ChildStore(this);
    this._stores.push(store);
    return store;
  }
}