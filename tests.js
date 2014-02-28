var expect    = require('expect.js'),
    llcoolj   = require('./llcoolj'),
    LL        = llcoolj.LL,
    ListNode  = llcoolj.ListNode;

describe('llcoolj', function () {
  var ll;

  /* global beforeEach: true */
  beforeEach(function () {
    ll = new LL();
    var n1 = new ListNode(5),
        n2 = new ListNode(1),
        n3 = new ListNode(7),
        n4 = new ListNode(4);

    ll.add(n1);
    ll.add(n2);
    ll.add(n3);
    ll.add(n4);
  });

  describe('adding nodes api', function () {

    describe('add', function () {
      it('adds a list node to the end if no index is supplied', function () {
        var n5 = new ListNode();
        ll.add(n5);

        // Not using tail as that should be another test
        function assertAtEnd(currentNode) {
          if (currentNode.next) {
            assertAtEnd(currentNode.next);
          } else {
            expect(currentNode).to.equal(n5);
          }
        }

        assertAtEnd(ll.head);
      });

      it('updates its tail pointer if adding a node at the end', function () {
        var n5 = new ListNode();
        ll.add(n5);

        expect(ll.tail).to.equal(n5);
      });

      it('updates its head pointer if adding a node at the front', function () {
        var ll2 = new LL(),
            n1 = new ListNode();

        ll2.add(n1);

        expect(ll2.head).to.equal(n1);
      });

      it('adds a list node at the specified index', function () {
        var n5 = new ListNode(),
            n6 = new ListNode();

        ll.add(0, n5);
        expect(ll.head).to.equal(n5);

        ll.add(1, n6);
        expect(ll.head.next).to.equal(n6);
      });

      it('throws if the supplied index is out of bounds', function () {
        var
            fn = function () {
             ll.add(100, new ListNode());
            },
            fn2 = function () {
              ll.add(-100, new ListNode());
            };

        expect(fn).to.throwException();
        expect(fn2).to.throwException();
      });

      it('increments the length of the list', function () {
        // Based on the beforeEach
        expect(ll.length).to.be(4);
        ll.add(new ListNode());
        expect(ll.length).to.be(5);
      });
    });

    describe('addFirst', function () {
      it('adds a node to the front of the list', function () {
        var n = new ListNode();
        ll.addFirst(n);

        expect(ll.head).to.equal(n);
      });

      it('increments the length of the list', function () {
        ll.addFirst(new ListNode());
        expect(ll.length).to.be(5);
      });
    });

    describe('addLast', function () {
      it('adds a node to the end of the list', function () {
        var n = new ListNode();
        ll.addLast(n);
        expect(ll.tail).to.equal(n);
      });

      it('increments the length of the list', function () {
        ll.addLast(new ListNode());
        expect(ll.length).to.be(5);
      });
    });
  });

  describe('search', function () {
    it('returns a reference to the node whose item is the given key', function () {
      var n = new ListNode(33);
      ll.add(n);
      expect(ll.search(33)).to.equal(n);
    });

    it('returns null if there is no node with an item equal to the given key', function () {
      expect(ll.search(100)).to.be(null);
    });
  });

  describe('getNodeAtIndex', function () {
    it('returns the node at the passed index', function () {
      var n = new ListNode();
      ll.add(n);
      expect(ll.getNodeAtIndex(ll.length - 1)).to.equal(n);
    });

    it('returns null if the index is out of bounds', function () {
      expect(ll.getNodeAtIndex(-1)).to.equal(null);
    });
  });

  describe('getPrevious', function () {
    it('returns the node that points to the given node', function () {
      var n = ll.getNodeAtIndex(0),
          n1 = ll.getNodeAtIndex(1);

      expect(ll.getPrevious(n1)).to.equal(n);
    });

    it('returns null if there is no node in front of the given node', function () {
      expect(ll.getPrevious(ll.getNodeAtIndex(0))).to.equal(null);
    });

    it('returns a list of previous nodes for each element if given an array', function () {
      var nodes = [ll.getNodeAtIndex(1), ll.getNodeAtIndex(3), ll.getNodeAtIndex(0)],
          prevs = ll.getPrevious(nodes);

      expect(prevs.length).to.be(3);
      expect(prevs[0]).to.equal(ll.getNodeAtIndex(0));
      expect(prevs[1]).to.equal(ll.getNodeAtIndex(2));
      expect(prevs[2]).to.equal(null);
    });
  });

  describe('getLast', function() {
    it('returns the last node in the list', function () {
      expect(ll.getLast()).to.equal(ll.tail);
    });

    it('returns null if the list is empty', function () {
      var ll2 = new LL();
      expect(ll2.getLast()).to.equal(null);
    });
  });

  describe('getSmallest', function () {
    it('returns a reference to the node with the smallest item', function () {
      expect(ll.getSmallest()).to.equal(ll.getNodeAtIndex(1));

      var n = new ListNode(-1);
      ll.add(n);
      expect(ll.getSmallest()).to.equal(n);
    });
  });

  describe('getLargest', function () {
    it('returns a reference to the node with the largest item', function () {
      expect(ll.getLargest()).to.equal(ll.getNodeAtIndex(2));
    });
  });

  describe('isEmpty', function () {
    it('returns true if the list is empty', function () {
      var ll2 = new LL();
      expect(ll2.isEmpty()).to.equal(true);
    });

    it('returns false if the list is not empty', function () {
      expect(ll.isEmpty()).to.equal(false);
    });
  });

  describe('exists', function () {
    it('returns true if the given node is in the list', function () {
      var n = new ListNode();
      ll.add(n);
      expect(ll.exists(n)).to.equal(true);
    });

    it('returns false if the given node is not in the list', function () {
      var n = new ListNode();
      expect(ll.exists(n)).to.equal(false);
    });
  });

  describe('clone', function () {
    it('returns a deep clone of a linked list', function () {
      var ll2 = ll.clone();

      for(var i = 0, l = ll2.length; i < l; i++) {
        // References should be different
        expect(ll2.getNodeAtIndex(i)).to.not.equal(ll.getNodeAtIndex(i));
        // Item values should be the same
        expect(ll2.getNodeAtIndex(i).item).to.equal(ll.getNodeAtIndex(i).item);
      }
    });
  });

  describe('clear', function () {
    it('removes all nodes from the list', function () {
      ll.clear();
      expect(ll.length).to.be(0);
      expect(ll.head).to.equal(null);
      expect(ll.tail).to.equal(null);
    });
  });

  describe('toString', function () {
    it('returns a string representation of the linked list', function () {
      expect(ll.toString()).to.equal('5 -> 1 -> 7 -> 4');
    });

    it('returns an empty representation for an empty list', function () {
      var ll2 = new LL();
      expect(ll2.toString()).to.equal('head -> null');
    });
  });

  describe('swapNodes', function () {
    it('in-place swaps two adjacent nodes', function () {
      var n0 = ll.getNodeAtIndex(0),
          n1 = ll.getNodeAtIndex(1);

      ll.swapNodes(n0, n1);

      expect(ll.getNodeAtIndex(0)).to.equal(n1);
      expect(ll.head).to.equal(n1);
      expect(ll.getNodeAtIndex(1)).to.equal(n0);
    });

    it('in-place swaps two non-adjacent nodes', function () {
      var n1 = ll.getNodeAtIndex(1),
          n3 = ll.getNodeAtIndex(3);

      ll.swapNodes(n1, n3);

      expect(ll.getNodeAtIndex(1)).to.equal(n3);
      expect(ll.getNodeAtIndex(3)).to.equal(n1);
      expect(ll.tail).to.equal(n1);
    });

    it('in-place swaps the head and tail elements', function () {
      var head = ll.head,
          tail = ll.tail;

      ll.swapNodes(head, tail);
      expect(ll.head).to.equal(tail);
      expect(ll.tail).to.equal(head);
    });
  });

  describe('reverse', function() {
    it('reverses the linked list in place', function () {
      var oldHead = ll.head,
          oldTail = ll.tail,
          n1 = ll.getNodeAtIndex(1);
      ll.reverse();
      expect(ll.head).to.equal(oldTail);
      expect(ll.tail).to.equal(oldHead);
      expect(ll.getNodeAtIndex(2)).to.equal(n1);
    });
  });

  describe('isDeepEqual', function() {
    it('returns true if the lists are deeply identical', function () {
      var ll2 = ll.clone();
      expect(ll.isDeepEqual(ll)).to.be(true);
      expect(ll.isDeepEqual(ll2)).to.be(false);
    });
  });

  describe('isEqual', function () {
    it('returns true if the lists have the same values', function () {
      var ll2 = ll.clone();
      expect(ll.isEqual(ll2)).to.be(true);
    });
  });
});
