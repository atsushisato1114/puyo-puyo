"""整数に関する数学ユーティリティ関数を提供するモジュール。

フィボナッチ数列・素数判定・最大公約数・最小公倍数・素因数分解など
基本的な整数演算を純粋関数として実装する。副作用なし。

Python 3.9 以上が必要（`list[int]` 型ヒントを使用）。

Note:
    旧ファイル名 `numbers.py` は Python 標準ライブラリの `numbers` モジュールと
    衝突するため `math_utils.py` に改名した。
"""

__all__ = ["fibonacci", "is_prime", "gcd", "lcm", "prime_factors"]


def fibonacci(n: int) -> int:
    """n 番目のフィボナッチ数を返す（0-indexed、F(0)=0、F(1)=1）。

    反復法で実装しているため、再帰上限の制約を受けない。

    Args:
        n: 0 以上の整数インデックス。

    Returns:
        n 番目のフィボナッチ数。F(0)=0、F(1)=1、F(n)=F(n-1)+F(n-2)。

    Raises:
        ValueError: n が負の整数のとき。

    Example:
        >>> fibonacci(0)
        0
        >>> fibonacci(7)
        13
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    if n == 0:
        return 0
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b


def is_prime(n: int) -> bool:
    """n が素数かどうかを判定する。

    2 と奇数のみを試算する最適化済み実装（O(√n) / 2）。

    Args:
        n: 判定対象の整数。

    Returns:
        n が素数のとき True、そうでないとき False。
        n < 2 のとき常に False。

    Example:
        >>> is_prime(2)
        True
        >>> is_prime(15)
        False
    """
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True


def gcd(a: int, b: int) -> int:
    """ユークリッドアルゴリズムで a と b の最大公約数を返す。

    負の整数は絶対値に変換して処理する。
    gcd(0, 0) は 0 を返す（数学的慣例）。

    Args:
        a: 整数（負・ゼロ可）。
        b: 整数（負・ゼロ可）。

    Returns:
        a と b の最大公約数（常に 0 以上の整数）。

    Example:
        >>> gcd(48, 18)
        6
        >>> gcd(-12, 8)
        4
    """
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a


def lcm(a: int, b: int) -> int:
    """a と b の最小公倍数を返す。

    lcm(a, b) = |a| // gcd(a, b) * |b| で計算する。
    中間値のオーバーフローを避けるため乗算前に除算する。

    Args:
        a: 整数（負・ゼロ可）。
        b: 整数（負・ゼロ可）。

    Returns:
        a と b の最小公倍数（常に 0 以上の整数）。
        どちらかが 0 のとき 0 を返す。

    Example:
        >>> lcm(4, 6)
        12
        >>> lcm(0, 5)
        0
    """
    if a == 0 or b == 0:
        return 0
    return abs(a) // gcd(a, b) * abs(b)


def prime_factors(n: int) -> list[int]:
    """n の素因数を昇順で返す（重複あり）。

    試し割り法。2 を別処理したうえで奇数のみを試算する。
    n=1 の素因数は存在しないため空リストを返す。

    Args:
        n: 1 以上の正の整数。

    Returns:
        素因数のリスト（昇順・重複あり）。
        例: 12 → [2, 2, 3]、1 → []

    Raises:
        ValueError: n が 1 未満のとき。

    Example:
        >>> prime_factors(12)
        [2, 2, 3]
        >>> prime_factors(17)
        [17]
    """
    if n < 1:
        raise ValueError("n must be a positive integer")
    factors: list[int] = []
    while n % 2 == 0:
        factors.append(2)
        n //= 2
    d = 3
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 2
    if n > 1:
        factors.append(n)
    return factors
