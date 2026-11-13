# weekday

Prints the weekday, in Portuguese, of each date it receives, so an agent never works it out in its head or copies it from an earlier message.

```sh
python3 .agents/scripts/weekday/weekday.py 2026-11-13 2026-11-14
# sexta-feira, 13/11/2026
# sábado, 14/11/2026

python3 .agents/scripts/weekday/weekday.py --extenso 2026-09-01
# terça-feira, 1 de setembro de 2026
```

- Input: dates as `AAAA-MM-DD`. The date is a civil day: the script ignores time and time zone, so the caller converts the instant to the event's time zone first.
- Output: one line per date, in the `Formato da data com dia da semana` (`terça-feira, 01/09/2026`). With `--extenso`, the `Formato da data na mensagem` (`terça-feira, 1 de setembro de 2026`).
- Exit code: 0 on success, 1 on a date that does not exist, 2 when no date is given.
- Test: `python3 .agents/scripts/weekday/test_weekday.py`. Standard library only.
