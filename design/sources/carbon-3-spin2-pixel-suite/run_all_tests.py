#!/usr/bin/env python3
"""
run_all_tests.py
Master zero-dependency verification runner for "What a Spin-2 Pixel Can Do That Light Cannot".
Executes all 7 test modules (Foundations + Questions 1 through 6) using only the Python 3
standard library (math, cmath, random) and asserts machine-precision agreement.
"""

import time
import test_00_foundations
import test_01_ranging
import test_02_spectral_matrix
import test_03_arrays
import test_04_crlb
import test_05_beyond_gr
import test_06_affordances


def main():
    print("=" * 100)
    print("SPIN-2 PIXEL VERIFICATION SUITE — COMPLETE NUMERICAL AUDIT")
    print("=" * 100)
    t0 = time.time()
    modules = [
        test_00_foundations,
        test_01_ranging,
        test_02_spectral_matrix,
        test_03_arrays,
        test_04_crlb,
        test_05_beyond_gr,
        test_06_affordances,
    ]
    for mod in modules:
        mod.run_tests()
    dt = time.time() - t0
    print("=" * 100)
    print(f"ALL 7 VERIFICATION SUITES PASSED CLEANLY IN {dt:.2f} s.")
    print("=" * 100)


if __name__ == "__main__":
    main()
