load('CarMat.mat');
imDir = fullfile('car');
addpath(imDir);
negativeFolder = fullfile('nocar');
trainCascadeObjectDetector('CarModel.xml',positiveInstances,negativeFolder,'FalseAlarmRate',0.2,'NumCascadeStages',12);

