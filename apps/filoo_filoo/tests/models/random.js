// ==========================================================================
// Project:   FilooFiloo.Random Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FilooFiloo module test ok equals same stop start */

module("FilooFiloo.Random");

test("A random integer should always be between O and n", function() {
  for(var n = 10; n < 100; n++ ) {

    var random = FilooFiloo.Random.randomInteger(n);
    ok(0 <= random, "A random integer should always be positive");
    ok(random < n, "A random integer should always be strictly inferior to its max");
  }
});

test("Next free index tests", function() {
  equals(FilooFiloo.Random.nextFreeIndex([NO],0), 0, "It should be 0 if the first index is false");
  equals(FilooFiloo.Random.nextFreeIndex([YES,NO],0), 1, "Can be the 1");
  equals(FilooFiloo.Random.nextFreeIndex([YES,YES,NO],0), 2, "Can even be 2");
  equals(FilooFiloo.Random.nextFreeIndex([YES,YES,NO],1), 2, "It does not matter where you start searching for");
  equals(FilooFiloo.Random.nextFreeIndex([YES,YES,NO,YES,NO],2), 2, "It should be start if the start index is false");
  equals(FilooFiloo.Random.nextFreeIndex([YES,YES,NO,YES,NO],3), 4, "Does not have to be the first \"hole\" if start is after it");
  ok(5 <= FilooFiloo.Random.nextFreeIndex([YES,YES,YES,YES,YES],0), "When no false index exist, it should return greater than the length of the array");

  ok(2 <= FilooFiloo.Random.nextFreeIndex([NO,YES],2), "Starting to search after the end of the array should return greater than the length of the array");
});

test("Next nth free index tests", function() {
  equals(FilooFiloo.Random.nthFreeIndex([NO],0), 0, "The free index '0' should be 0 if false");
  equals(FilooFiloo.Random.nthFreeIndex([YES,NO],0), 1, "The free index '0' should be the first false");
  equals(FilooFiloo.Random.nthFreeIndex([YES,NO,YES,YES,NO],1), 4, "The free index '1' should be the second false");
  equals(FilooFiloo.Random.nthFreeIndex([YES,NO,YES,YES,NO,NO],2), 5, "The free index '2' should be the third false");
  equals(FilooFiloo.Random.nthFreeIndex([YES,NO,YES,YES,NO,NO],3), -1, "Passed the number of false in the array, the free index should be -1");
});

test("Random unique integers should be unique", function() {
  for(var n = 0; n <= 10; n++) {
    var max = n*n;

    var integers = FilooFiloo.Random.randomUniqueIntegers(n, max);
    equals(integers.length, n, "Exactly "+n+" random integers should be returned.");

    var tester = {};
    integers.forEach(function(i) {
      ok(0 <= i && i < max, "All random integers should be within 0 and "+max);
      equals(tester[i], undefined, "random integers should be unique");
      tester[i] = YES;
    });

  }
});

