import RouterMatcher from '@/utils/router-matcher';
import Html5History from '@/history/Html5History';
import HashHistory from '@/history/HashHistory';

export default class Router {
    constructor(mount, mode = 'hash') {
        this._mount = document.getElementById(mount);
        if (!this._mount) {
            throw new Error(`Can not get mount point document.getElementById(#{mount})...`)
        }
        this._subRouterView = '<div id="__sub-router-view"></div>'
        this._subMount = null;
        this._isPassing = false;
        this._cache = {};
        this._middlewares = [];
        this._matcher = new RouterMatcher();

        this._history = mode === 'hash'
            ? new HashHistory({ matcher: this._matcher})
            : new Html5History({ matcher: this._matcher})
    }

    render(dom) {
        if (this._isPassing) {
            this._subMount.innerHTML = dom;
        } else {
            this._mount.innerHTML = dom;
        }
    }

    next(dom) {
        this._mount.innerHTML = dom;
        this._isPassing = this._history.getMatchedCount() > 1;
        this._subMount = document.querySelector('#__sub-router-view');
    }

    subRoute() {
        return this._subRouterView;
    }

    use(middleware) {
        this._middlewares.push(middleware);
    }

    route(path, middleware) {
        this._matcher.add(path, (request) => {
           if (path !== '*' && !request._id) {
               for (let i=0; i< this._middlewares.length; i++) {
                   this._middlewares[i](request)
               }
           }
           middleware(request, this, this.next,)
        });
    }
}