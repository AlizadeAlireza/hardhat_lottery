describe("includes", function() {

    it("should get an include tag from a supplied src", function() {
        var src = "<html><body><include>test.html</include></body></html>";

        includes.setSrc(src);
        var tag = includes.getTag();

        expect(tag).not.toBeUndefined();
        expect(tag).not.toBeNull();
        expect(tag.start).toEqual(12);
        expect(tag.end).toEqual(40);
        expect(tag.inner).toEqual("test.html");
    });

    it("shouldn't get an include tag if one doesn't exist", function() {
        var src = "<html><body>Nothing to see here</body></html>";

        includes.setSrc(src);
        var tag = includes.getTag();
        var tags = includes.getTags();

        expect(tag).toBeUndefined();
        expect(tags).toEqual([]);
    });

    it("should get multiple include tags from a supplied src", function() {
        var src = "<html><body><include>test.html</include><include>test2.html</include>" +
            "<div>div<div><include>test3.html</include></body></html>";

        includes.setSrc(src);
        var tag1 = includes.getTag(),
            tag2 = includes.getTag(tag1.end),
            tag3 = includes.getTag(tag2.end);

        expect(tag1).toEqual({start: 12, end: 40, inner: "test.html"});
        expect(tag2).toEqual({start: 40, end: 69, inner: "test2.html"});
        expect(tag3).toEqual({start: 82, end: 111, inner: "test3.html"});
    });

    it("should get all tags in an array when calling getTags()", function() {
        var src = "<html><body><include>test.html</include><include>test2.html</include>" +
            "<div>div<div><include>test3.html</include></body></html>";

        includes.setSrc(src);
        var tags = includes.getTags();

        expect(tags.length).toEqual(3);
        expect(tags[0]).toEqual({start: 12, end: 40, inner: "test.html"});
        expect(tags[1]).toEqual({start: 40, end: 69, inner: "test2.html"});
        expect(tags[2]).toEqual({start: 82, end: 111, inner: "test3.html"});
    });

}); 