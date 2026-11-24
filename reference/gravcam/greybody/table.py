"""Greybody table Gamma_l(x) for l = 2..lmax on a grid of x, saved as table.npz (x, l, G)."""
import numpy as np
from multiprocessing import Pool
from greybody import gamma, V

xs = np.concatenate([np.linspace(0.01, 0.2, 20), np.linspace(0.21, 2.0, 180), np.linspace(2.02, 6.0, 200)])
ls = np.arange(2, 41)


def vmax(l):
    r = np.linspace(2.01, 10, 20000)
    return V(r, l).max()


VM = {l: vmax(l) for l in ls}


def job(args):
    i, j = args
    x, l = xs[i], ls[j]
    if x * x < 0.25 * VM[l]:
        # deep under the barrier: compute only for low l, where it matters for counts at small x
        if l > 4:
            return i, j, 0.0
    if x * x > 4.0 * VM[l]:
        return i, j, 1.0
    return i, j, gamma(int(l), float(x), rmax_fac=300.0, rtol=1e-10)


if __name__ == '__main__':
    G = np.zeros((len(xs), len(ls)))
    with Pool(8) as p:
        for i, j, g in p.imap_unordered(job, [(i, j) for i in range(len(xs)) for j in range(len(ls))], chunksize=4):
            G[i, j] = g
    np.savez('table.npz', x=xs, l=ls, G=G)
    print('done', G.shape)
