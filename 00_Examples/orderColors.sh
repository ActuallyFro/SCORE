#!/bin/bash
awk -F'#' '{
    gsub("\r","",$2);
    print $2
}' colors.txt | awk 'BEGIN{RS=ORS="\n"}{print}' | sort -k1,1V > ordered-colors.txt
