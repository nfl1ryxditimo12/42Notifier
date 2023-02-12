### Variable #######################################

EVENT_PROCESS       :=  notifier_event
EXAM_PROCESS        :=  notifier_exam

_ERROR              :=  "\\033[31m"
_SUCCESS            :=  "\\033[32m"
_WARNING            :=  "\\033[33m"
_DEFAULT            :=  "\\033[0m"

_ERROR_LOG          :=  "$(_ERROR)Error:$(_DEFAULT) %s\n"
_SUCCESS_LOG        :=  "\n$(_SUCCESS)[%s]$(_DEFAULT)\n\n"
_WARNING_LOG        :=  "\n$(_WARNING)[%s]$(_DEFAULT)\n"

### Phony ##########################################

.PHONY: all start deploy

### Common #########################################

all: start

start:
	@REPLY=""; \
	\
	printf $(_WARNING_LOG) "Please select a process to run"; \
	printf " 1) event\n"; \
	printf " 2) exam\n"; \
	read -p " > " -r; \
	\
	REPLY=`echo $$REPLY | sed 's/^ *//'`; \
	if [[ ! $$REPLY =~ ^(1|2|event|exam)$$ ]]; then \
		printf $(_ERROR_LOG) "Allowed input: 1, 2, event, exam"; \
		exit 0; \
	fi; \
	\
	[[ $$REPLY -eq 1 || "$$REPLY" == "event" ]] && TYPE=event || TYPE=exam; \
	\
	printf $(_SUCCESS_LOG) "\"$$TYPE\" process will be running"; \
	NODE_TYPE=$$TYPE yarn start;

deploy:
	@yarn build; \
	pm2 delete $(EVENT_PROCESS) 2> /dev/null; \
	pm2 delete $(EXAM_PROCESS) 2> /dev/null; \
	NODE_ENV=event yarn deploy --name $(EVENT_PROCESS); \
	NODE_ENV=exam yarn deploy --name $(EXAM_PROCESS);
