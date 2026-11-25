import subprocess,statistics as st,re,os
def page(label,engine,n,reps,env=None):
    W=[];C=[];P=[];ok=0
    e=dict(os.environ)
    if env: e.update(env)
    for i in range(reps):
        r=subprocess.run(['tests/motor/cmp/one.sh',engine,str(n)],capture_output=True,text=True,env=e).stdout
        m=re.search(r'wall=(\d+)ms cpu=([\d.]+)s peak=(\d+)MB rc=(\d+) \| (.*)',r)
        if not m: print('ERRO',r[:200]);continue
        W.append(int(m[1]));C.append(float(m[2]));P.append(int(m[3]))
        if f'final=Count is {n} ' in m[5]: ok+=1
    print(f'| {label} | {n} | {st.median(W):.0f} | {min(W)}-{max(W)} | {st.median(C):.2f} | {st.median(P):.0f} | {ok}/{reps} |',flush=True)
O2={'CAUSTIC_JS_OPT':'-O0'}
page('js2cst O0 sem cache','caustic-cold',0,5,O2)
for n in (0,2000):
    page('js2cst O0 com cache','caustic',n,10,O2)
    page('node+jsdom','jsdom',n,10)
    page('node+linkedom','linkedom',n,10)
    page('qjs+linkedom','qjs',n,10)
page('js2cst O0 sem cache','caustic-cold',2000,5,O2)
