import List from 'list/list';

export const TOP_ALL = -1;

let defaultOptions =  {
  GroupsTitle: 'Groups',
  UsersTitle: 'Users',
  getPluralForUserCount: count => '',
  searchMax: 20,
  cacheExpireTime: 60/*sec*/ * 1000
};

export default class HubUsersGroupsSource {
  constructor(auth, options) {
    this.auth = auth;
    this.options = Object.assign({}, defaultOptions, options);

    this.groupsCache = {
      content: null,
      validUntil: 0
    };
  }

  makeRequest(relativeUrl, params) {
    return this.auth.requestToken()
      .then(token => this.auth.getApi(relativeUrl, token, params));
  }

  makeCachedRequest(cache, ...args) {
    if (Date.now() > cache.validUntil) {
      return this.makeRequest(...args)
        .then(res => {
          cache.content = res;
          cache.validUntil = Date.now() +  + this.options.cacheExpireTime;
          return res;
        });
    }
    return Promise.resolve(cache.content);
  }

  static prepareFilter(filter) {
    if (filter && filter.indexOf(' ') !== -1) {
      return '{' + filter + '}'
    }
    return filter;
  }

  getUsers(filter = '') {
    filter = HubUsersGroupsSource.prepareFilter(filter);

    return this.makeRequest('users', {
      query: filter ? `nameStartsWith: ${filter} or loginStartsWith: ${filter}` : '',
      fields: 'id,name,login,profile/avatar/url',
      orderBy: 'name',
      $top: this.options.searchMax
    })
      .then(response => response.users || [])
  }

  getGroups(filter = '') {
    return this.makeCachedRequest(this.groupsCache, 'usergroups', {
      fields: 'id,name,userCount',
      orderBy: 'name',
      $top: TOP_ALL
    })
      .then(({usergroups = []}) => {
        return usergroups.filter(group => {
          return group.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        });
      });
  }

  getUserAndGroups(filter) {
    return Promise.all([this.getUsers(filter), this.getGroups(filter)]);
  }
}
