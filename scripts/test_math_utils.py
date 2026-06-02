"""math_utils モジュールのテストスイート。

pytest を使用し、各関数に対してハッピーパス・境界値・エラーケースを網羅する。
"""

import pytest
from math_utils import fibonacci, is_prime, gcd, lcm, prime_factors


# ---------------------------------------------------------------------------
# fibonacci
# ---------------------------------------------------------------------------

class TestFibonacci:
    """fibonacci(n) のテスト。"""

    # ハッピーパス
    def test_zero(self):
        assert fibonacci(0) == 0

    def test_one(self):
        assert fibonacci(1) == 1

    def test_two(self):
        assert fibonacci(2) == 1

    def test_small_values(self):
        expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
        for i, val in enumerate(expected):
            assert fibonacci(i) == val, f"fibonacci({i}) should be {val}"

    def test_n_7(self):
        assert fibonacci(7) == 13

    def test_n_10(self):
        assert fibonacci(10) == 55

    def test_large_n(self):
        # F(50) は既知の値
        assert fibonacci(50) == 12586269025

    # 境界値
    def test_boundary_zero(self):
        """0 は有効な最小値。"""
        assert fibonacci(0) == 0

    def test_boundary_one(self):
        """1 は 2 番目の有効値。"""
        assert fibonacci(1) == 1

    # エラーケース
    def test_negative_raises_value_error(self):
        with pytest.raises(ValueError):
            fibonacci(-1)

    def test_large_negative_raises_value_error(self):
        with pytest.raises(ValueError):
            fibonacci(-100)

    def test_negative_error_message(self):
        with pytest.raises(ValueError, match="non-negative"):
            fibonacci(-1)


# ---------------------------------------------------------------------------
# is_prime
# ---------------------------------------------------------------------------

class TestIsPrime:
    """is_prime(n) のテスト。"""

    # ハッピーパス: 素数
    def test_2_is_prime(self):
        assert is_prime(2) is True

    def test_3_is_prime(self):
        assert is_prime(3) is True

    def test_5_is_prime(self):
        assert is_prime(5) is True

    def test_7_is_prime(self):
        assert is_prime(7) is True

    def test_11_is_prime(self):
        assert is_prime(11) is True

    def test_13_is_prime(self):
        assert is_prime(13) is True

    def test_97_is_prime(self):
        assert is_prime(97) is True

    def test_large_prime(self):
        assert is_prime(7919) is True

    # ハッピーパス: 素数でない
    def test_4_is_not_prime(self):
        assert is_prime(4) is False

    def test_9_is_not_prime(self):
        assert is_prime(9) is False

    def test_15_is_not_prime(self):
        assert is_prime(15) is False

    def test_100_is_not_prime(self):
        assert is_prime(100) is False

    # 境界値
    def test_zero_is_not_prime(self):
        assert is_prime(0) is False

    def test_one_is_not_prime(self):
        assert is_prime(1) is False

    def test_two_is_smallest_prime(self):
        assert is_prime(2) is True

    # エラーケース（負の整数は False を返す仕様）
    def test_negative_returns_false(self):
        assert is_prime(-1) is False

    def test_large_negative_returns_false(self):
        assert is_prime(-100) is False

    # 偶数の複合チェック
    def test_even_composite(self):
        assert is_prime(8) is False

    def test_even_composite_large(self):
        assert is_prime(1000) is False


# ---------------------------------------------------------------------------
# gcd
# ---------------------------------------------------------------------------

class TestGcd:
    """gcd(a, b) のテスト。"""

    # ハッピーパス
    def test_basic(self):
        assert gcd(48, 18) == 6

    def test_coprime(self):
        assert gcd(7, 13) == 1

    def test_same_value(self):
        assert gcd(12, 12) == 12

    def test_one_is_multiple_of_other(self):
        assert gcd(10, 5) == 5

    def test_large_values(self):
        assert gcd(1000000, 500000) == 500000

    # 負の整数
    def test_negative_a(self):
        assert gcd(-12, 8) == 4

    def test_negative_b(self):
        assert gcd(12, -8) == 4

    def test_both_negative(self):
        assert gcd(-12, -8) == 4

    # 境界値
    def test_zero_a(self):
        """gcd(0, n) = n"""
        assert gcd(0, 5) == 5

    def test_zero_b(self):
        """gcd(n, 0) = n"""
        assert gcd(5, 0) == 5

    def test_both_zero(self):
        """gcd(0, 0) = 0 (数学的慣例)"""
        assert gcd(0, 0) == 0

    def test_one_and_any(self):
        assert gcd(1, 100) == 1

    def test_prime_pair(self):
        """2 つの異なる素数の gcd は 1。"""
        assert gcd(17, 13) == 1


# ---------------------------------------------------------------------------
# lcm
# ---------------------------------------------------------------------------

class TestLcm:
    """lcm(a, b) のテスト。"""

    # ハッピーパス
    def test_basic(self):
        assert lcm(4, 6) == 12

    def test_coprime(self):
        assert lcm(7, 13) == 91

    def test_same_value(self):
        assert lcm(5, 5) == 5

    def test_one_divides_other(self):
        assert lcm(3, 9) == 9

    def test_small_values(self):
        assert lcm(2, 3) == 6

    # 負の整数
    def test_negative_a(self):
        assert lcm(-4, 6) == 12

    def test_negative_b(self):
        assert lcm(4, -6) == 12

    def test_both_negative(self):
        assert lcm(-4, -6) == 12

    # 境界値
    def test_zero_a(self):
        """lcm(0, n) = 0"""
        assert lcm(0, 5) == 0

    def test_zero_b(self):
        """lcm(n, 0) = 0"""
        assert lcm(5, 0) == 0

    def test_both_zero(self):
        assert lcm(0, 0) == 0

    def test_one_and_any(self):
        assert lcm(1, 100) == 100

    # 大きな値
    def test_large_values(self):
        assert lcm(100, 200) == 200


# ---------------------------------------------------------------------------
# prime_factors
# ---------------------------------------------------------------------------

class TestPrimeFactors:
    """prime_factors(n) のテスト。"""

    # ハッピーパス
    def test_prime(self):
        """素数自身が唯一の因数。"""
        assert prime_factors(17) == [17]

    def test_12(self):
        assert prime_factors(12) == [2, 2, 3]

    def test_36(self):
        assert prime_factors(36) == [2, 2, 3, 3]

    def test_2(self):
        assert prime_factors(2) == [2]

    def test_3(self):
        assert prime_factors(3) == [3]

    def test_8(self):
        assert prime_factors(8) == [2, 2, 2]

    def test_30(self):
        assert prime_factors(30) == [2, 3, 5]

    def test_100(self):
        assert prime_factors(100) == [2, 2, 5, 5]

    # 境界値
    def test_one_returns_empty(self):
        """1 の素因数は存在しない → 空リスト。"""
        assert prime_factors(1) == []

    def test_large_prime(self):
        assert prime_factors(7919) == [7919]

    def test_result_is_sorted(self):
        """結果は昇順に並んでいること。"""
        result = prime_factors(60)
        assert result == sorted(result)

    def test_product_equals_original(self):
        """素因数の積が元の数と等しいこと。"""
        n = 360
        factors = prime_factors(n)
        product = 1
        for f in factors:
            product *= f
        assert product == n

    # エラーケース
    def test_zero_raises_value_error(self):
        with pytest.raises(ValueError):
            prime_factors(0)

    def test_negative_raises_value_error(self):
        with pytest.raises(ValueError):
            prime_factors(-1)

    def test_large_negative_raises_value_error(self):
        with pytest.raises(ValueError):
            prime_factors(-100)

    def test_negative_error_message(self):
        with pytest.raises(ValueError, match="positive"):
            prime_factors(-5)
