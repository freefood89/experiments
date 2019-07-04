.PHONY: main1 shared

main1:
	gcc -o main1 main1.c sum.c

main2:
	gcc -o main2 main2.c ./sum.so

shared:
	gcc -shared -fPIC -o sum.so sum.c

clean:
	rm main1 main2 sum.so
