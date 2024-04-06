var X=Object.defineProperty;var Y=(c,t,s)=>t in c?X(c,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):c[t]=s;var p=(c,t,s)=>(Y(c,typeof t!="symbol"?t+"":t,s),s);import{i as O,T as Z,v as y,M as q,b as _,w as B,z as G,A as E}from"./mesh-DYwoPhri.js";import{j as u,l as V,r as d,u as T,v as $,w as R,f as m,n as A,o as I,x as k,y as C,z as F,k as J,c as j,m as S,A as K,E as L,H as Q}from"./three.module-lM_mZEoP.js";var w;(function(c){c[c.Orthographic=0]="Orthographic",c[c.Perspective=1]="Perspective",c[c.Frustum=2]="Frustum"})(w||(w={}));function H(c){throw new Error("Unexpected object: "+c)}function W(c){return Array.isArray(c)&&c.length===3&&typeof c[0]=="number"&&typeof c[1]=="number"&&typeof c[2]=="number"}function tt(c){return Array.isArray(c)&&c.length===4&&typeof c[0]=="number"&&typeof c[1]=="number"&&typeof c[2]=="number"&&typeof c[3]=="number"}class it{constructor({transform:t=new Z,type:s=w.Orthographic,frustum:o={left:-1,right:1,bottom:-1,top:1},perspectiveParam:r={fovy:90*Math.PI/180,aspect:1},near:e=.1,far:i=100,lookAtPoint:n=y()}={}){p(this,"transform");p(this,"type");p(this,"frustum");p(this,"perspectiveParam");p(this,"near");p(this,"far");p(this,"lookAtPoint");this.transform=t,this.type=s,this.frustum=o,this.perspectiveParam=r,this.near=e,this.far=i,this.lookAtPoint=n}worldToClip(t){let s=!1;if(s=W(t)||tt(t)){let o=t;s&&(o=C(o));const r=this.getVPMatrix(),e=u();d(e,o,r);const i=m(e[3],e[3],e[3],e[3]);return F(e,e,i),e}else{if(t.length===0)return;s=!1,W(t[0])&&(s=!0);const o=Array(),r=Array();s?t.forEach(i=>{r.push(C(i))}):t.forEach(i=>{r.push(i)});const e=this.getVPMatrix();return r.forEach(i=>{let n=i;const a=u();d(a,n,e);const h=m(a[3],a[3],a[3],a[3]);F(a,a,h),o.push(a)}),o}}worldToScreen(t,s){const o=this.worldToClip(t),r=J(o);return r[0]=(o[0]/2+.5)*s.width,r[1]=(-o[1]/2+.5)*s.height,r}objectToClip(t){if(t instanceof q){const s=t,o=s.transform.getModelMatrix(),r=this.getVPMatrix(),e=j();S(e,r,o);const i=[];return s.mesh.vertice.forEach(n=>{const a=C(n.position),h=u();d(h,a,e);const f=m(h[3],h[3],h[3],h[3]);F(h,h,f),i.push(h)}),i}else{const s=this.getVPMatrix(),o=t,r=[];return o.forEach(e=>{const i=u();d(i,e,s);const n=m(i[3],i[3],i[3],i[3]);F(i,i,n),r.push(i)}),r}}getProjectionMatrix(){switch(this.type){case w.Orthographic:return this.getOrthographicMatrix();case w.Perspective:return this.getPerspectiveMatrix();default:return H(this.type)}}getOrthographicMatrix(){const t=j();return K(t,this.frustum.left,this.frustum.right,this.frustum.bottom,this.frustum.top,this.near,this.far)}getPerspectiveMatrix(){const t=j();return L(t,this.perspectiveParam.fovy,this.perspectiveParam.aspect,this.near,this.far)}getViewMatrix(){const t=j();return Q(t,this.transform.translate,this.lookAtPoint,_(0,1,0)),t}getVPMatrix(){const t=this.getViewMatrix(),s=this.getProjectionMatrix(),o=j();return S(o,s,t),o}getForward(){const t=y();return B(t,this.lookAtPoint,this.transform.translate),G(t,t),t}getUp(){const t=this.getForward(),s=this.getRight(),o=y();return E(o,t,s),o}getRight(){const t=this.getForward(),s=y();return E(s,_(0,1,0),t),s}}class et{constructor({transform:t=new O,type:s=w.Orthographic,frustum:o={left:-1,right:1,bottom:-1,top:1,back:-1,front:1},perspectiveParam:r={xField:90,yField:90,zField:90},inside:e=.1,outside:i=100,lookAtPoint:n=u()}={}){p(this,"transform");p(this,"type");p(this,"frustum");p(this,"perspectiveParam");p(this,"inside");p(this,"outside");p(this,"lookAtPoint");this.transform=t,this.type=s,this.frustum=o,this.perspectiveParam=r,this.inside=e,this.outside=i,this.lookAtPoint=n}worldToCamera(t){const s=u();return V(s,t,this.transform.translate),s}cameraToView(t){const s=this.getViewMatrix4DWithoutTranslate(),o=u();return d(o,t,s),o}viewToClip(t){const s=this.getProjectionMatrix4D(),o=s.projectionMatrix4D,r=s.projectParam,e=u();d(e,t,o),T(e,e,r.translate);const i=$(t,r.m5x1_5x4)+r.m5x5,n=u();return R(n,e,m(i,i,i,i)),n}objectToClip(t,s){if(t instanceof O){const r=t.transform(s),e=this.worldToCamera(r),i=this.cameraToView(e);return this.viewToClip(i)}else{const o=t,r=o.transform.getRotationScaleMatrix(),e=u();V(e,o.transform.translate,this.transform.translate);const i=this.getViewMatrix4DWithoutTranslate(),n=this.getProjectionMatrix4D(),a=n.projectionMatrix4D,h=n.projectParam,f=[];return o.mesh.vertice.forEach(M=>{const l=u();d(l,M.position,r),T(l,l,e);const g=u();d(g,l,i);const x=u();d(x,g,a),T(x,x,h.translate);const P=$(g,h.m5x1_5x4)+h.m5x5,v=u();R(v,x,m(P,P,P,P)),f.push(v)}),f}}getOutSide(){const t=u(),s=this.lookAtPoint,o=this.transform.translate;return V(t,s,o)}getViewMatrix4DWithoutTranslate(){const t=u(),s=m(0,0,1,0),o=m(0,1,0,0),r=u(),e=this.lookAtPoint,i=this.transform.translate;return V(t,e,i),A(t,t),I(r,o,s,t),A(r,r),I(o,s,t,r),A(o,o),I(s,t,r,o),A(s,s),k(r[0],o[0],s[0],t[0],r[1],o[1],s[1],t[1],r[2],o[2],s[2],t[2],r[3],o[3],s[3],t[3])}getProjectionMatrix4D(){switch(this.type){case w.Orthographic:return this.getOrthographicMatrix4D();case w.Frustum:return this.getFrustumMatrix4D();case w.Perspective:return this.getPerspectiveMatrix4D();default:return H(this.type)}}getOrthographicMatrix4D(){const t=this.frustum.left,s=this.frustum.right,o=this.frustum.bottom,r=this.frustum.top,e=this.frustum.back,i=this.frustum.right,n=this.inside,a=this.outside,h=1/(t-s),f=1/(o-r),M=1/(e-i),l=1/(n-a),g=(t+s)*h,x=(o+r)*f,P=(e+i)*M,v=(n+a)*l,D=k(-2*h,0,0,0,0,-2*f,0,0,0,0,-2*M,0,0,0,0,-2*l),b=m(g,x,P,v),z=u();return{projectionMatrix4D:D,projectParam:{translate:b,m5x1_5x4:z,m5x5:1}}}getFrustumMatrix4D(){const t=this.frustum.left,s=this.frustum.right,o=this.frustum.bottom,r=this.frustum.top,e=this.frustum.back,i=this.frustum.right,n=this.inside,a=this.outside,h=1/(s-t),f=1/(r-o),M=1/(i-e),l=1/(a-n),g=0,x=0,P=0,v=-2*n*a*l,D=k(2*n*h,0,0,0,0,2*n*f,0,0,0,0,2*n*M,0,-(t+s)*h,-(o+r)*f,-(e+i)*M,(a+n)*l),b=m(g,x,P,v),z=m(0,0,0,1);return{projectionMatrix4D:D,projectParam:{translate:b,m5x1_5x4:z,m5x5:0}}}getPerspectiveMatrix4D(){const t=this.perspectiveParam.xField*Math.PI/180,s=1/Math.tan(t/2),o=this.perspectiveParam.yField*Math.PI/180,r=1/Math.tan(o/2),e=this.perspectiveParam.zField*Math.PI/180,i=1/Math.tan(e/2),n=this.inside,a=this.outside,h=1/(a-n),f=0,M=0,l=0,g=-2*n*a*h,x=k(s,0,0,0,0,r,0,0,0,0,i,0,0,0,0,(a+n)*h),P=m(f,M,l,g),v=m(0,0,0,1);return{projectionMatrix4D:x,projectParam:{translate:P,m5x1_5x4:v,m5x5:0}}}}export{it as C,w as P,et as a};
