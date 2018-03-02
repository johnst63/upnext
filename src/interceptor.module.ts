// import { Injectable, NgModule} from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import 'rxjs/add/operator/do';
// @Injectable()
// export class HttpsRequestInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('Intercepting:');
//     console.log(req);
//     const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') });
//     console.log(dupReq);
//     console.log('Done Intercepting');
//     return next.handle(dupReq);
//   }
// }
// @NgModule({
//   providers: [
//     { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true }
//   ]
// })
// export class InterceptorModule { }
