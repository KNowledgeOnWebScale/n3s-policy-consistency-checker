.PHONY: n3 odrl clean

n3:
	@ ./bin/run_all.sh

odrl:
	@ ./bin/run_all_odrl.sh

clean:
	@ ./bin/clean.sh