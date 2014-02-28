// Singly linked list without a tail pointer
// O(n) lookups
// O(1) insert at head and tail
// O(1) + search time insert anywhere else
var LL = module.exports.LL = function () {
  this.head = null;
  this.tail = null;

  // We keep this to avoid looping through the entire list
  // when asking for the current length
  this.length = 0;
};

// A single node in the linked list
var ListNode = module.exports.ListNode = function (item, next) {
  this.item = item || 0;
  this.next = next || null;
};

// Returns a reference to the first node whose item is the given key
// Or null if the key was not found
LL.prototype.search = function (key) {
  if (this.isEmpty()) return null;

  var head = this.head;

  do {
    if (head.item === key) {
      return head;
    }
  } while (head = head.next);

  return null;
};

// Supports add(ListNode) and add(index, ListNode)
LL.prototype.add = function (index, listNode) {
  var head;

  // If index is an instance of ListNode, add at end
  if (index instanceof ListNode) {
    this.addLast(index);
    return;
  }

  if (index < 0 || index >= this.length) {
    throw new Error('index is not valid');
  }

  // Otherwise, add element at index
  if (index === 0) {
    this.addFirst(listNode);
    return;
  }

  // Out of bounds
  if (index < 0) {
    return;
  }

  // Grab the node before the one we're to replace
  head = this.getNodeAtIndex(index - 1);

  listNode.next = head.next;
  head.next = listNode;

  this.length++;
};

// Returns the node at the given index
// or null if the index of of bounds
// Note: zero-based indexing
LL.prototype.getNodeAtIndex = function (index) {
  var head = this.head,
      curIdx = 0;

  if (index < 0 || index >= this.length) return null;

  // Optimizations
  if (index === 0) return head;
  if (index === this.length - 1) return this.tail;

  while (head = head.next) {
    curIdx++;
    if (index === curIdx) return head;
  }

  return null;
};

// Inserts the given node at beginning of the list
LL.prototype.addFirst = function (listNode) {
  assertType(listNode);

  listNode.next = this.head;
  this.head = listNode;

  this.length++;

  // If this is the first and only element
  // then the tail and head point to the same node
  if (! this.tail) {
    this.tail = listNode;
  }
};

// Inserts the given node at the end of the list
LL.prototype.addLast = function (listNode) {
  assertType(listNode);

  var tail = this.tail;

  if (! tail) {
    this.addFirst(listNode);
    return;
  }

  // The last node looks at the new (last) node
  tail.next = listNode;

  // The tail pointer updates to the new last node
  this.tail = listNode;

  this.length++;
};

LL.prototype.remove = function (listNode) {
  assertType(listNode);

  // Find the previous node (the node with the passed node as its next)
  var previous = this.getPrevious(listNode);

  // Set the previous' next as node's next (implicit deletion due to ref count)
  previous.next = listNode.next;

  this.length--;
};

// Returns a reference to the element before the given node
// If given an array, returns a list of previous nodes
// for each node in the list or null for an alement with no previous node
LL.prototype.getPrevious = function (listNode) {
  var head = this.head,
      isArray = listNode instanceof Array,
      // The previous nodes for each element of the supplied array (if it is an array)
      results, idx;

  // The head has no previous
  if (this.head === listNode) return null;

  if (isArray) {
    results = [];
    for (var i = 0, l = listNode.length; i < l; i++) {
      results[i] = null;
    }
  }

  while (head.next) {
    if (isArray) {
      // If the current node points to a node in the search list
      idx = listNode.indexOf(head.next);
      // The current node is its previous
      if (idx !== -1) {
        results[idx] = head;
      }

    } else {
      if (head.next === listNode) return head;
    }

    head = head.next;
  }

  return isArray ? results : null;
};

// Returns a deep clone of the current linked list
LL.prototype.clone = function () {
  var ll = new LL(),
      head = this.head;

  if (this.isEmpty()) return ll;

  // Copy every node to LL
  do {
    ll.add(new ListNode(head.item));
  } while (head = head.next);

  return ll;
};

// Returns a reference to the last element in the list or null
// if the list is empty
LL.prototype.getLast = function () {
  return this.tail;
};

LL.prototype.isEmpty = function () {
  return ! this.head;
};

// Returns a boolean representing whether or not
// the given node is in the list
LL.prototype.exists = function (listNode) {
  assertType(listNode);

  var head = this.head;

  // If it's the head or tail, then return true
  if (listNode === this.head || listNode === this.tail) return true;

  // Otherwise, loop through the list
  while (head = head.next) {
    if (head === listNode) return true;
  }

  return false;
};

// Removes all elements from the list
LL.prototype.clear = function () {
  if (this.isEmpty()) return;

  // Recursively set the node's next to null
  function destroyNext(currentNode) {
    if (currentNode.next) destroyNext(currentNode.next);

    currentNode.next = null;
  }

  destroyNext.call(this, this.head);
  this.head = null;
  this.tail = null;
  this.length = 0;
};

// Format: item -> item -> item
LL.prototype.toString = function () {
  var head = this.head,
      result = '';

  if (this.isEmpty()) return 'head -> null';

  do {
    result += head.item;

    // Avoid a stray arrow for the last node
    if (head.next) result += ' -> ';

  } while (head = head.next);

  return result;
};

LL.prototype.reverse = function () {
  function rev(cur, prev) {
    // We hit the end of the list
    // our new head
    if (! cur.next) {
      this.head = cur;

    } else {
      rev.call(this, cur.next, cur);
    }

    cur.next = prev;

    if (! prev) {
      this.tail = cur;
    }
  }

  // An empty or single-element list is already reversed
  if (this.length < 2) return;

  rev.call(this, this.head, null);
};

// Returns true if the given list is deeply identical, false otherwise
LL.prototype.isDeepEqual = function (ll) {
  if (this.isEmpty() && ll.isEmpty()) return true;
  // Make sure the head and tail are identical
  if (this.length !== ll.length || this.head !== ll.head || this.tail !== ll.tail) return false;

  var head = this.head,
      llhead = ll.head;

  // Make sure all inner nodes are equal
  while (head = head.next) {
    llhead = llhead.next;
    if (head !== llhead) return false;
  }

  return true;
};

// Returns true if the given list is shallowly equal, false otherwise
LL.prototype.isEqual = function (ll) {
  // If the values between lists are the same, they'll have the
  // same string representation
  return this.toString() === ll.toString();
};

// Returns the node with the smallest value in the list
LL.prototype.getSmallest = function () {
  if (this.isEmpty()) return null;

  var head          = this.head,
      smallest      = head.item,
      smallestNode  = head;

  while (head = head.next) {
    if (head.item < smallest) {
      smallest = head.item;
      smallestNode = head;
    }
  }

  return smallestNode;
};

// Returns the node with the largest value in the list
LL.prototype.getLargest = function () {
  if (this.isEmpty()) return null;

  var head        = this.head,
      largest     = head.item,
      largestNode = head;

  while (head = head.next) {
    if (head.item > largest) {
      largest = head.item;
      largestNode = head;
    }
  }

  return largestNode;
};

// Precond: listNode1 and listNode2 must be nodes already in the list
LL.prototype.swapNodes = function (listNode1, listNode2) {
  assertType(listNode1);
  assertType(listNode2);

  // Grab the nodes before the nodes to swap and
  // have them point to the nodes in swapped order
  var prev1, prev2, temp;

  prev1 = this.getPrevious([listNode1, listNode2]);
  prev2 = prev1[1];
  prev1 = prev1[0];

  if (prev1) {
    prev1.next = listNode2;
  }

  if (prev2) {
    prev2.next = listNode1;
  }

  // If one of the swapped nodes was the head or tail,
  // update those pointers to the other element
  if (this.head === listNode1) {
    this.head = listNode2;

  } else if (this.head === listNode2) {
    this.head = listNode1;
  }

  if (this.tail === listNode1) {
    this.tail = listNode2;

  } else if (this.tail === listNode2) {
    this.tail = listNode1;
  }

  // Swap what each node points to
  temp = listNode1.next;
  listNode1.next = listNode2.next;
  listNode2.next = temp;
};

LL.prototype.slice = function () {
  // TODO
};

LL.prototype.bubbleSort = function () {
  // TODO
};

LL.prototype.selectionSort = function () {
  // TODO
};

////////////////////
// Internal Helpers
////////////////////

// Throws a TypeError if the given input is not a ListNode
function assertType (listNode) {
  if (! (listNode instanceof ListNode)) {
    throw new TypeError('must be of type ListNode');
  }
}